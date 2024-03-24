import Documents from "@/components/Documents";
import Sidenav from "@/components/Sidenav";

interface DocumentsPageProps {
  params: { slug: string },
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function DocumentsPage({params, searchParams}: DocumentsPageProps) {
  return (
    <div>
      <Sidenav />
      <Documents slug={params.slug} name={searchParams.name} />
    </div>
  )
};
