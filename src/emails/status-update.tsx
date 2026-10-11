import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Text } from "@react-email/components";

export type StatusUpdateProps = {
  siteName: string;
  supportEmail: string;
  applicantName: string;
  orderNumber: string;
  trackingUrl: string;
  statusLabel: string;
  statusDescription: string;
  note?: string | null;
};

export function StatusUpdateEmail(p: StatusUpdateProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Order ${p.orderNumber}: ${p.statusLabel}`}</Preview>
      <Body style={{ backgroundColor: "#f4f5f7", fontFamily: "Helvetica, Arial, sans-serif", padding: "24px 0" }}>
        <Container style={{ backgroundColor: "#ffffff", borderRadius: 8, padding: 32, maxWidth: 560 }}>
          <Heading style={{ fontSize: 22, color: "#111827" }}>Your order status: {p.statusLabel}</Heading>
          <Text style={{ fontSize: 15, color: "#374151" }}>Hi {p.applicantName},</Text>
          <Text style={{ fontSize: 15, color: "#374151" }}>{p.statusDescription}</Text>
          {p.note && <Text style={{ fontSize: 15, color: "#374151", fontStyle: "italic" }}>{p.note}</Text>}
          <Button
            href={p.trackingUrl}
            style={{ backgroundColor: "#1d4ed8", color: "#fff", borderRadius: 6, padding: "12px 24px", fontWeight: 600 }}
          >
            Track order {p.orderNumber}
          </Button>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0 12px" }} />
          <Text style={{ fontSize: 13, color: "#6b7280" }}>
            Questions? Contact <Link href={`mailto:${p.supportEmail}`}>{p.supportEmail}</Link>. {p.siteName}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default StatusUpdateEmail;
