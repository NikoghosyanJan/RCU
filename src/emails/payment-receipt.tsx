import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

export type PaymentReceiptProps = {
  siteName: string;
  supportEmail: string;
  applicantName: string;
  orderNumber: string;
  trackingUrl: string;
  receiptUrl?: string | null;
  paidAt: string;
  legalName: string;
  usdotNumber: string;
  registrationYear: number;
  bracket: string;
  ucrFee: string;
  serviceFee: string;
  total: string;
  disclaimer: string;
};

export function PaymentReceiptEmail(p: PaymentReceiptProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Payment received for order ${p.orderNumber}: track your UCR filing`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Payment received</Heading>
          <Text style={text}>Hi {p.applicantName},</Text>
          <Text style={text}>
            Thank you for your order. We received your payment and will start preparing your {p.registrationYear} UCR
            registration for <strong>{p.legalName}</strong>.
          </Text>

          <Section style={box}>
            <Text style={label}>Order number</Text>
            <Text style={orderNo}>{p.orderNumber}</Text>
            <Button href={p.trackingUrl} style={button}>
              Track your order
            </Button>
            <Text style={small}>
              Or open this link: <Link href={p.trackingUrl}>{p.trackingUrl}</Link>
            </Text>
          </Section>

          <Heading as="h2" style={h2}>Receipt</Heading>
          <Section>
            <ReceiptRow label="Date" value={p.paidAt} />
            <ReceiptRow label="Company" value={p.legalName} />
            <ReceiptRow label="USDOT" value={p.usdotNumber} />
            <Hr style={hr} />
            <ReceiptRow label={`${p.registrationYear} UCR fee (bracket ${p.bracket})`} value={p.ucrFee} />
            <ReceiptRow label="Service fee" value={p.serviceFee} />
            <Hr style={hr} />
            <ReceiptRow label="Total paid" value={p.total} bold />
          </Section>
          {p.receiptUrl && (
            <Text style={small}>
              Payment processor receipt: <Link href={p.receiptUrl}>view receipt</Link>
            </Text>
          )}

          <Hr style={hr} />
          <Text style={small}>
            Questions? Reply to this email or contact us at <Link href={`mailto:${p.supportEmail}`}>{p.supportEmail}</Link>.
          </Text>
          <Text style={tiny}>{p.disclaimer}</Text>
          <Text style={tiny}>{p.siteName}</Text>
        </Container>
      </Body>
    </Html>
  );
}

function ReceiptRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <Row>
      <Column style={{ ...cell, fontWeight: bold ? 700 : 400 }}>{label}</Column>
      <Column style={{ ...cell, textAlign: "right", fontWeight: bold ? 700 : 400 }}>{value}</Column>
    </Row>
  );
}

const body = { backgroundColor: "#f4f5f7", fontFamily: "Helvetica, Arial, sans-serif", padding: "24px 0" };
const container = { backgroundColor: "#ffffff", borderRadius: 8, padding: "32px", maxWidth: 560 };
const h1 = { fontSize: 24, margin: "0 0 16px", color: "#111827" };
const h2 = { fontSize: 18, margin: "24px 0 8px", color: "#111827" };
const text = { fontSize: 15, lineHeight: "22px", color: "#374151" };
const box = { backgroundColor: "#f1f5ff", borderRadius: 8, padding: "20px", textAlign: "center" as const, margin: "20px 0" };
const label = { fontSize: 12, textTransform: "uppercase" as const, color: "#6b7280", margin: 0 };
const orderNo = { fontSize: 22, fontWeight: 700, letterSpacing: 1, color: "#1e3a8a", margin: "4px 0 16px" };
const button = { backgroundColor: "#1d4ed8", color: "#ffffff", borderRadius: 6, padding: "12px 24px", fontSize: 15, fontWeight: 600, textDecoration: "none" };
const cell = { fontSize: 14, color: "#374151", padding: "4px 0" };
const hr = { borderColor: "#e5e7eb", margin: "12px 0" };
const small = { fontSize: 13, color: "#6b7280", lineHeight: "20px" };
const tiny = { fontSize: 11, color: "#9ca3af", lineHeight: "16px" };

export default PaymentReceiptEmail;
