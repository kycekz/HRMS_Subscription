import React from 'react';
import Navigation from '../../components/Navigation';

const browserHeader = (title: string) => (
  <div style={{ background: '#17324d', color: 'white', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '7px' }}>
    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff6b61' }} />
    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffc34f' }} />
    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#42c98a' }} />
    <span style={{ marginLeft: 10, fontSize: '0.8rem', opacity: 0.9 }}>{title}</span>
  </div>
);

const panelStyle: React.CSSProperties = {
  background: 'white', borderRadius: 18, overflow: 'hidden', boxShadow: '0 18px 45px rgba(15, 67, 97, 0.14)', minWidth: 0,
};

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: 6, fontWeight: 600 };
const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '9px 10px', background: '#f8fafc', border: '1px solid #dbe5ee', borderRadius: 7, color: '#334155', fontSize: '0.8rem' };

const LHDNEInvoice: React.FC = () => (
  <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#1e293b' }}>
    <Navigation />
    <main style={{ marginTop: 80 }}>
      <section style={{ background: 'linear-gradient(135deg, #075985 0%, #0f766e 58%, #14b8a6 100%)', color: 'white', padding: 'clamp(72px, 11vw, 118px) 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 420, height: 420, border: '1px solid rgba(255,255,255,.17)', borderRadius: '50%', top: -230, right: '-6%' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, border: '1px solid rgba(255,255,255,.15)', borderRadius: '50%', bottom: -160, left: '4%' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.28)', borderRadius: 99, padding: '8px 15px', fontWeight: 600, fontSize: '.86rem', marginBottom: 20 }}>LHDN e-Invoice Solution</div>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)', margin: '0 0 20px', lineHeight: 1.1 }}>Invoice with confidence. Submit with ease.</h1>
          <p style={{ fontSize: 'clamp(1rem, 2.3vw, 1.25rem)', lineHeight: 1.65, opacity: .95, maxWidth: 720, margin: '0 auto 30px' }}>A simple workspace to prepare, submit and track your LHDN e-Invoices—then keep customers informed with validated invoice emails.</p>
          <a href="#contact" style={{ display: 'inline-block', padding: '14px 28px', borderRadius: 99, background: 'white', color: '#0f766e', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.18)' }}>Talk to our team</a>
        </div>
      </section>

      <section style={{ padding: 'clamp(55px, 9vw, 90px) 20px', background: '#f5fbfb' }}>
        <div style={{ maxWidth: 1150, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 45px' }}>
            <h2 style={{ fontSize: 'clamp(1.85rem, 4vw, 2.65rem)', margin: '0 0 14px', color: '#0f3d50' }}>Everything your invoicing flow needs</h2>
            <p style={{ margin: 0, color: '#526475', fontSize: '1.05rem', lineHeight: 1.65 }}>Designed to help finance teams reduce manual work, stay organised and deliver a clearer experience to every customer.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 22, marginBottom: 56 }}>
            {[
              ['✓', 'Friendly, guided interface', 'Create e-Invoices with a clean workflow that makes essential details easy to review.'],
              ['↗', 'Direct LHDN submission', 'Prepare and submit invoices to the LHDN e-Invoice platform from one central workspace.'],
              ['✉', 'Automatic customer emails', 'Send a polished validated-invoice notification to your client after a successful response.'],
              ['◷', 'Clear validation tracking', 'See submitted, validated and action-required invoices at a glance, with a full activity trail.'],
            ].map(([icon, title, text]) => <article key={title} style={{ background: 'white', padding: 25, borderRadius: 14, border: '1px solid #dcebed', boxShadow: '0 5px 18px rgba(15, 67, 97, .06)' }}>
              <div style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: 10, background: '#d9f4ef', color: '#0f766e', fontWeight: 800, marginBottom: 16 }}>{icon}</div>
              <h3 style={{ margin: '0 0 9px', fontSize: '1.08rem', color: '#123b4d' }}>{title}</h3>
              <p style={{ margin: 0, color: '#607182', lineHeight: 1.6, fontSize: '.93rem' }}>{text}</p>
            </article>)}
          </div>

          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.7rem, 3.5vw, 2.35rem)', margin: '0 0 12px', color: '#0f3d50' }}>A simple flow, from invoice to customer</h2>
          <p style={{ textAlign: 'center', color: '#607182', margin: '0 auto 35px', maxWidth: 700 }}>Six connected views that show how the application can support your daily e-Invoice process.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            <article style={panelStyle}>
              {browserHeader('Create e-Invoice')}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}><strong>New e-Invoice</strong><span style={{ color: '#0f766e', background: '#d9f4ef', padding: '5px 8px', borderRadius: 99, fontSize: '.7rem', fontWeight: 700 }}>DRAFT</span></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><div><span style={labelStyle}>Buyer name</span><div style={inputStyle}>Acme Trading Sdn. Bhd.</div></div><div><span style={labelStyle}>Invoice no.</span><div style={inputStyle}>INV-2026-0184</div></div></div>
                <div style={{ marginTop: 12 }}><span style={labelStyle}>Invoice total</span><div style={{ ...inputStyle, fontWeight: 700, color: '#0f766e' }}>RM 2,480.00</div></div>
                <button style={{ marginTop: 16, width: '100%', border: 0, borderRadius: 8, padding: 10, background: '#0f766e', color: 'white', fontWeight: 700 }}>Review e-Invoice</button>
              </div>
            </article>

            <article style={panelStyle}>
              {browserHeader('Submission centre')}
              <div style={{ padding: 20 }}>
                <strong style={{ display: 'block', marginBottom: 14 }}>Submission centre</strong>
                {[['INV-2026-0184', 'Ready to submit', '#fef3c7', '#92400e'], ['INV-2026-0183', 'Submitted', '#dbeafe', '#1d4ed8'], ['INV-2026-0182', 'Validated', '#d9f4ef', '#0f766e']].map(([number, status, bg, color]) => <div key={number} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #e7edf2', gap: 8 }}><div><strong style={{ fontSize: '.84rem' }}>{number}</strong><span style={{ display: 'block', fontSize: '.7rem', color: '#718096', marginTop: 3 }}>Updated moments ago</span></div><span style={{ background: bg, color, padding: '5px 8px', borderRadius: 99, fontSize: '.67rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{status}</span></div>)}
                <button style={{ marginTop: 15, width: '100%', border: 0, borderRadius: 8, padding: 10, background: '#0c4a6e', color: 'white', fontWeight: 700 }}>Submit to LHDN</button>
              </div>
            </article>

            <article style={panelStyle}>
              {browserHeader('Validated invoice email')}
              <div style={{ padding: 20 }}>
                <div style={{ color: '#64748b', fontSize: '.72rem', marginBottom: 12 }}>TO: finance@acmetrading.com</div>
                <div style={{ border: '1px solid #dcebed', borderRadius: 9, padding: 15, background: '#fbfefe' }}>
                  <div style={{ color: '#0f766e', fontWeight: 800, fontSize: '1rem', marginBottom: 12 }}>Your e-Invoice is validated</div>
                  <p style={{ fontSize: '.78rem', lineHeight: 1.55, color: '#526475', margin: '0 0 12px' }}>Hello Acme Trading, your e-Invoice INV-2026-0182 has been successfully validated.</p>
                  <div style={{ background: '#d9f4ef', color: '#0f766e', padding: 9, textAlign: 'center', borderRadius: 6, fontSize: '.75rem', fontWeight: 700 }}>View validated invoice</div>
                </div>
                <div style={{ marginTop: 12, fontSize: '.72rem', color: '#64748b' }}>Sent automatically after validation</div>
              </div>
            </article>

            <article style={panelStyle}>
              {browserHeader('e-Invoice overview')}
              <div style={{ padding: 20 }}>
                <strong style={{ display: 'block', marginBottom: 14 }}>This month</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[['126', 'Submitted'], ['119', 'Validated'], ['5', 'In progress'], ['2', 'Action needed']].map(([value, label], index) => <div key={label} style={{ padding: 12, borderRadius: 8, background: index === 3 ? '#fff7ed' : '#f1f8f8' }}><strong style={{ display: 'block', fontSize: '1.35rem', color: index === 3 ? '#c2410c' : '#0f766e' }}>{value}</strong><span style={{ fontSize: '.7rem', color: '#64748b' }}>{label}</span></div>)}
                </div>
                <div style={{ marginTop: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', marginBottom: 7 }}><span>Validation progress</span><strong style={{ color: '#0f766e' }}>94%</strong></div><div style={{ height: 8, borderRadius: 99, background: '#e5edef' }}><div style={{ height: '100%', width: '94%', borderRadius: 99, background: 'linear-gradient(90deg, #0f766e, #2dd4bf)' }} /></div></div>
              </div>
            </article>

            <article style={panelStyle}>
              {browserHeader('Email delivery status')}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}><strong>Validated invoice sent</strong><span style={{ color: '#0f766e', background: '#d9f4ef', padding: '5px 8px', borderRadius: 99, fontSize: '.67rem', fontWeight: 700 }}>DELIVERED</span></div>
                <div style={{ padding: 13, borderRadius: 9, background: '#f1f8f8', borderLeft: '4px solid #14b8a6' }}>
                  <strong style={{ fontSize: '.82rem', color: '#123b4d' }}>INV-2026-0182</strong>
                  <span style={{ display: 'block', fontSize: '.73rem', color: '#64748b', marginTop: 5 }}>Sent to finance@acmetrading.com</span>
                </div>
                <div style={{ marginTop: 14, display: 'grid', gap: 9 }}>
                  {[['LHDN validation received', '10:32 AM'], ['Email notification sent', '10:33 AM'], ['Customer opened invoice', '10:41 AM']].map(([event, time]) => <div key={event} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: '.73rem', color: '#526475' }}><span><span style={{ color: '#0f766e', fontWeight: 800, marginRight: 7 }}>✓</span>{event}</span><span style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>{time}</span></div>)}
                </div>
                <button style={{ marginTop: 16, width: '100%', border: '1px solid #0f766e', borderRadius: 8, padding: 9, background: 'white', color: '#0f766e', fontWeight: 700 }}>Resend email</button>
              </div>
            </article>

            <article style={panelStyle}>
              {browserHeader('Import invoices')}
              <div style={{ padding: 20 }}>
                <strong style={{ display: 'block', marginBottom: 5 }}>Import from accounting system</strong>
                <span style={{ display: 'block', color: '#64748b', fontSize: '.73rem', marginBottom: 15 }}>Bring invoice data into one e-Invoice workspace.</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[['SQL Account', 'Connected'], ['AutoCount', 'Connected'], ['Xero', 'Connect'], ['CSV file', 'Upload']].map(([source, action], index) => <div key={source} style={{ border: '1px solid #dcebed', borderRadius: 8, padding: 10, background: index < 2 ? '#f1f8f8' : 'white' }}><strong style={{ display: 'block', fontSize: '.75rem', color: '#123b4d' }}>{source}</strong><span style={{ display: 'block', marginTop: 5, color: index < 2 ? '#0f766e' : '#64748b', fontSize: '.68rem', fontWeight: 700 }}>{index < 2 ? '✓ ' : ''}{action}</span></div>)}
                </div>
                <div style={{ marginTop: 14, background: '#f8fafc', border: '1px dashed #a8bcc5', borderRadius: 8, padding: 12, textAlign: 'center', color: '#526475', fontSize: '.75rem' }}>Drop an invoice export here or choose a file</div>
                <button style={{ marginTop: 14, width: '100%', border: 0, borderRadius: 8, padding: 10, background: '#0c4a6e', color: 'white', fontWeight: 700 }}>Import 24 invoices</button>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: 'clamp(55px, 9vw, 85px) 20px', textAlign: 'center', background: '#123b4d', color: 'white' }}>
        <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.65rem)', margin: '0 0 15px' }}>Ready to simplify your e-Invoice workflow?</h2>
        <p style={{ margin: '0 auto 25px', maxWidth: 650, opacity: .86, lineHeight: 1.6 }}>Let’s explore how LHDN e-Invoice can fit into your current invoicing process.</p>
        <a href="mailto:enquiry@amazingcube.com.my" style={{ color: 'white', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid #7dd3c7' }}>enquiry@amazingcube.com.my</a>
      </section>
    </main>
  </div>
);

export default LHDNEInvoice;
