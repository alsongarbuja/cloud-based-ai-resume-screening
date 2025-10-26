import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function JobsList() {
  return (
    <>
      <PageMeta
        title="KaamAI | Posted Jobs"
        description="List of posted jobs by your organization"
      />
      <div className="space-y-6">
        <ComponentCard title="Posted Jobs" btnText="job">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
