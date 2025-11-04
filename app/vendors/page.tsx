import VendorForm from "@/components/VendorForm";

export const metadata = {
  title: "Vendor Submission",
};

export default function VendorsPage() {
  return (
    <section className="form-card" style={{ marginTop: 24 }}>
      <h2 className="section-title">Vendor submission</h2>
      <p className="help" style={{ marginBottom: 16 }}>
        Provide at least your first name, resource list (optional), budget range, and optionally upload your CV and rate card.
      </p>
      <VendorForm />
    </section>
  );
}
