import { METAINFO } from 'constants/metaInfo';
import { AuthSession } from './AuthSession';
import './globals.css';

export const metadata = {
  title: { default: METAINFO.DEFAULT.TITLE },
  description: { default: METAINFO.DEFAULT.DESCRIPTION },
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthSession>{children}</AuthSession>
      </body>
    </html>
  );
}
