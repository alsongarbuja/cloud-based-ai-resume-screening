import ComponentCard from "../../components/common/ComponentCard";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function JobsList() {
  return (
    <>
      {/* <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      /> */}
      <div className="space-y-6">
        <ComponentCard title="Posted Jobs">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
