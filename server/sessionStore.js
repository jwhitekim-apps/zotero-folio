// express-session용 Supabase 세션 저장소.
//
// 기본 MemoryStore는 프로세스 메모리에만 세션을 두므로, 컨테이너가 재시작
// (배포마다 docker compose up --build, 크래시 후 restart 등)될 때마다 모든
// 로그인이 풀린다. 세션 데이터(folio_users.id, OAuth 진행 중 임시 토큰)를
// folio_sessions 테이블에 두어 재시작 후에도 유지한다.
// 테이블은 server/supabase/schema.sql로 수동 생성한다.

import session from 'express-session';
import { supabase } from './supabase.js';

const SESSIONS = 'folio_sessions';
const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function expiresAt(sess) {
  const exp = sess?.cookie?.expires ? new Date(sess.cookie.expires) : new Date(Date.now() + DEFAULT_TTL_MS);
  return exp.toISOString();
}

export class SupabaseSessionStore extends session.Store {
  async get(sid, cb) {
    try {
      const { data, error } = await supabase
        .from(SESSIONS)
        .select('sess, expires_at')
        .eq('sid', sid)
        .maybeSingle();
      if (error) throw error;
      if (!data) return cb(null, null);
      if (new Date(data.expires_at) <= new Date()) {
        this.destroy(sid, () => {});
        return cb(null, null);
      }
      cb(null, data.sess);
    } catch (err) {
      console.error('[session] 조회 실패:', err.message);
      cb(err);
    }
  }

  async set(sid, sess, cb = () => {}) {
    try {
      const { error } = await supabase
        .from(SESSIONS)
        .upsert({ sid, sess, expires_at: expiresAt(sess) }, { onConflict: 'sid' });
      if (error) throw error;
      cb(null);
    } catch (err) {
      console.error('[session] 저장 실패:', err.message);
      cb(err);
    }
  }

  async destroy(sid, cb = () => {}) {
    try {
      const { error } = await supabase.from(SESSIONS).delete().eq('sid', sid);
      if (error) throw error;
      cb(null);
    } catch (err) {
      console.error('[session] 삭제 실패:', err.message);
      cb(err);
    }
  }

  // resave:false일 때 만료 시각만 연장한다 (rolling 세션 대비).
  async touch(sid, sess, cb = () => {}) {
    try {
      const { error } = await supabase
        .from(SESSIONS)
        .update({ expires_at: expiresAt(sess) })
        .eq('sid', sid);
      if (error) throw error;
      cb(null);
    } catch (err) {
      console.error('[session] 갱신 실패:', err.message);
      cb(err);
    }
  }
}
