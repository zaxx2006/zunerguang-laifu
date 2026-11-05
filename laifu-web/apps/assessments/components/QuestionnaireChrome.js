import { homeFooterColumns } from "../../../shared/site-navigation";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const MAIN_SITE_URL = process.env.NEXT_PUBLIC_MAIN_SITE_URL || (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://laifu-web.pages.dev");
export function QuestionnaireHeader() {
  return (
    <header className="questionnaire-header">
      <nav className="questionnaire-nav" aria-label="测评导航">
        <div className="questionnaire-container questionnaire-nav__inner">
          <a className="questionnaire-brand" href={`${BASE_PATH}/`} aria-label="焕屿困境辅导自测工具首页">
            <img src={`${BASE_PATH}/assets/huanyu-logo.svg`} width="40" height="40" alt="" />
            <span>
              <strong>焕屿</strong>
              <small>困境辅导 · 专业自测</small>
            </span>
          </a>
          <div className="questionnaire-links">
            <a href={`${BASE_PATH}/`}>离婚准备测评</a>
            <a href={`${BASE_PATH}/narcissism-risk/`}>婚姻互动风险测评</a>
            <a className="questionnaire-booking-button" href={`${MAIN_SITE_URL}/book-consultation/`} target="_blank" rel="noopener noreferrer">预约咨询</a>
          </div>
          <details className="questionnaire-mobile-menu">
            <summary className="questionnaire-menu-button" aria-label="测评导航菜单">
              <svg className="questionnaire-menu-icon questionnaire-menu-icon--open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              <svg className="questionnaire-menu-icon questionnaire-menu-icon--close" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
            </summary>
            <div className="questionnaire-mobile-drawer">
              <nav aria-label="移动测评导航">
                <a href={`${BASE_PATH}/`}>离婚准备测评</a>
                <a href={`${BASE_PATH}/narcissism-risk/`}>婚姻互动风险测评</a>
                <a className="questionnaire-mobile-booking" href={`${MAIN_SITE_URL}/book-consultation/`} target="_blank" rel="noopener noreferrer">预约咨询</a>
              </nav>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}

export function QuestionnaireFooter() {
  return (
    <footer className="questionnaire-footer">
      <div className="questionnaire-container">
        <nav className="questionnaire-footer-grid" aria-label="页脚导航">
          {homeFooterColumns.map((column) => (
            <section className="questionnaire-footer-column" key={column.title}>
              <h2>{column.title}</h2>
              <div>{column.links.map(([href, label]) => <a href={`${MAIN_SITE_URL}${href}`} target="_blank" rel="noopener noreferrer" key={href}>{label}</a>)}</div>
            </section>
          ))}
        </nav>
        <div className="questionnaire-footer-brand">
          <div>
            <a className="questionnaire-footer-identity" href={`${MAIN_SITE_URL}/`} target="_blank" rel="noopener noreferrer" aria-label="焕屿困境辅导首页">
              <img src={`${BASE_PATH}/brand/Logo-light.svg`} width="48" height="48" alt="" />
              <span><strong>焕屿</strong><small>困境辅导 · HUANYU</small></span>
            </a>
            <small className="questionnaire-copyright">焕屿 · HUANYU © {new Date().getFullYear()}</small>
          </div>
          <div className="questionnaire-footer-statement">
            <p>焕屿以离婚陪伴辅导为核心，在需要时协同合作律师及其他专业人士，帮助客户更清晰、更稳定地走过离婚。</p>
            <small>本网站内容不构成法律意见、心理治疗或医疗建议。</small>
          </div>
        </div>
      </div>
    </footer>
  );
}
