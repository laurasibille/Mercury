import { CompanyDetailPage } from "@/components/swapiz/companies/CompanyDetailPage";
import { swapizDemoData } from "@/data/swapiz-demo";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return swapizDemoData.organizations.filter(item => item.kind === "company").map(item => ({ companyId: item.id }));
}

export default async function Page({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const company = swapizDemoData.organizations.find(item => item.id === companyId && item.kind === "company");
  if (!company) notFound();
  return <CompanyDetailPage key={companyId} company={company} />;
}
