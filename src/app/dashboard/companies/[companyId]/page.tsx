import { CompanyDetailPage } from "@/components/swapiz/companies/CompanyDetailPage";
import { swapizDemoData } from "@/data/swapiz-demo";

export const dynamicParams = false;

export function generateStaticParams() {
  return swapizDemoData.organizations.filter(item => item.kind === "company").map(item => ({ companyId: item.id }));
}

export default async function Page({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  return <CompanyDetailPage key={companyId} companyId={companyId} />;
}
