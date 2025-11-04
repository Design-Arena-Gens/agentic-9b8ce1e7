import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="form-card" style={{ marginTop: 24 }}>
      <h2 className="section-title">Welcome</h2>
      <p>
        This site provides a dedicated section for vendors to submit their resource list,
        expected budget range, and optional documents.
      </p>
      <p style={{ marginTop: 12 }}>
        Proceed to the <Link href="/vendors" className="button" style={{ padding: '8px 12px', textDecoration: 'none' }}>Vendor Submission</Link> page.
      </p>
    </section>
  );
}
