import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from '@react-email/components'

interface VerificationEmailProps {
    username: string;
    otp: string;
}
export default function VerificationEmail({ username, otp }
    : VerificationEmailProps) {
    return (
        <Html lang='en' dir='ltr'>
            <Head>
                <title>Email Verification</title>
                <Font
                    fontFamily='Roboto'
                    fallbackFontFamily={"Verdana"}
                    fontWeight={400}
                    fontStyle='normal'
                />
            </Head>
            <Preview> Here&apos;s your Verification Code: {otp}
            </Preview>
            <Section>
                <Row>
                    <Heading as='h2'>
                        Email Verification
                    </Heading>
                </Row>
                <Row>
                    <Text>
                        Hello {username},
                        Thank your for registration your account. Use OTP below to complete your account creation.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        {otp}
                    </Text>
                </Row>
            </Section>
        </Html>
    )
}