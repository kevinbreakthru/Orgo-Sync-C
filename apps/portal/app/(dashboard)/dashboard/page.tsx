import { createSupabaseServerClient } from "../../../lib/supabase/server";
import { PageHeader } from "../../../components/shared/page-header";
import { OverviewClient } from "../../../components/dashboard/overview-client";
import { PlatformQRCard } from "../../../components/dashboard/platform-qr-card";

export default async function DashboardOverviewPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: partner } = await supabase
    .from("partners")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { count: keyCount } = await supabase
    .from("api_keys")
    .select("*", { count: "exact", head: true })
    .eq("partner_id", partner?.id ?? "")
    .is("revoked_at", null);

  const { count: usageCount } = await supabase
    .from("api_usage_log")
    .select("*", { count: "exact", head: true })
    .eq("partner_id", partner?.id ?? "");

  return (
    <div>
      <PageHeader
        title="Partner Dashboard"
        description="Interoperability overview and quick actions."
      />

      <OverviewClient
        orgName={partner?.org_name ?? "—"}
        tier={partner?.tier ?? "sandbox"}
        keyCount={keyCount ?? 0}
        usageCount={usageCount ?? 0}
      />

      <PlatformQRCard />
    </div>
  );
}
