'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ViewType } from '@supabase/auth-ui-shared';

import { useClientSupabase } from '@/lib/auth/client-supabase-provider';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter, useSearchParams } from 'next/navigation';
import { getURL } from '@/lib/helpers';

export const revalidate = 0;

/**
 * This page allows for loging in or signing up.
 *
 * @param view - the auth view that should be active upon loading. Options:
 * - sign_up - DEFAULT
 * - sign_in
 * - forgotten_password
 * - magic_link
 * - update_password
 * @param redirect_url - the url to redirect to after successful login
 */
export default function Authentificate({
  redirect_url,
  view,
}: {
  redirect_url?: string;
  view?: string;
}) {
  // Hooks
  const supabase = useClientSupabase();

  return (
    <>
      <h2 className="mb-4 text-center text-xl font-bold">
        Registrácia | Prihlásenie
      </h2>
      <Auth
        supabaseClient={supabase}
        socialLayout="horizontal"
        magicLink={true}
        redirectTo={redirect_url || undefined} // TODO: Not working
        view={view as ViewType}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'white',
                brandAccent: '#ffaf87',
                brandButtonText: 'black',
                defaultButtonBackground: 'white',
                defaultButtonBackgroundHover: '#ffcfb7',
                defaultButtonBorder: 'lightgray',
                defaultButtonText: 'gray',
                dividerBackground: '#eaeaea',
                inputBackground: 'transparent',
                inputBorder: 'lightgray',
                inputBorderHover: '#ffcfb7',
                inputBorderFocus: '#ffcfb7',
                inputText: 'black',
                inputLabelText: 'gray',
                inputPlaceholder: 'darkgray',
                messageText: 'gray',
                messageTextDanger: 'red',
                anchorTextColor: 'gray',
                anchorTextHoverColor: 'darkgray',
              },
              space: {
                spaceSmall: '4px',
                spaceMedium: '8px',
                spaceLarge: '16px',
                labelBottomMargin: '4px',
                anchorBottomMargin: '4px',
                emailInputSpacing: '4px',
                socialAuthSpacing: '4px',
                buttonPadding: '10px 15px',
                inputPadding: '10px 15px',
              },
              fontSizes: {
                baseBodySize: '14px',
                baseInputSize: '16px',
                baseLabelSize: '16px',
                baseButtonSize: '18px',
              },
              fonts: {
                bodyFontFamily: `inherit`,
                buttonFontFamily: `inherit`,
                inputFontFamily: `inherit`,
                labelFontFamily: `inherit`,
              },
              // fontWeights: {},
              // lineHeights: {},
              // letterSpacings: {},
              // sizes: {},
              borderWidths: {
                buttonBorderWidth: '2px',
                inputBorderWidth: '2px',
              },
              // borderStyles: {},
              radii: {
                borderRadiusButton: '12px',
                buttonBorderRadius: '12px',
                inputBorderRadius: '12px',
              },
              // shadows: {},
              // zIndices: {},
              // transitions: {},
            },
          },
        }}
        localization={{
          variables: {
            sign_up: {
              email_label: 'Emailová adresa',
              password_label: 'Vytvorte si heslo',
              email_input_placeholder: 'Zadajte emailovú adresu',
              password_input_placeholder: 'Vaše heslo',
              button_label: 'Registrovať sa',
              loading_button_label: 'Registrujem...',
              social_provider_text: 'Prihláste sa pomocou {{provider}}',
              link_text: 'Nemáte účet? Zaregistrujte sa.',
              confirmation_text:
                'Na email sme vám poslali link s potvrdením registrácie.',
            },
            sign_in: {
              email_label: 'Emailová adresa',
              password_label: 'Heslo',
              email_input_placeholder: 'Zadajte emailovú adresu',
              password_input_placeholder: 'Heslo',
              button_label: 'Prihlásiť sa',
              loading_button_label: 'Prihlasujem...',
              social_provider_text: 'Prihláste sa pomocou {{provider}}',
              link_text: 'Máte účet? Prihláste sa.',
            },
            magic_link: {
              email_input_label: 'Emailová adresa',
              email_input_placeholder: 'Zadajte emailovú adresu',
              button_label: 'Odoslať MAGIC LINK',
              loading_button_label: 'Posielam MAGIC LINK...',
              link_text: 'Zaslať MAGIC LINK',
              confirmation_text:
                'Na mail sme vám poslali MAGIC LINK, kliknite naň pre prihlásenie.',
            },
            forgotten_password: {
              email_label: 'Emailová adresa',
              password_label: 'Heslo',
              email_input_placeholder: 'Zadajte emailovú adresu',
              button_label: 'Odoslať mail s inštrukciami',
              loading_button_label: 'Odosielam...',
              link_text: 'Zabudli ste heslo?',
              confirmation_text:
                'Na mail sme vám poslali inštrukcie na resetovanie hesla.',
            },
            update_password: {
              password_label: 'Nové heslo',
              password_input_placeholder: 'Zadajte nové heslo',
              button_label: 'Obnoviť heslo',
              loading_button_label: 'Obnovujem',
              confirmation_text: 'Vaše heslo sme úspešne zmenili',
            },
          },
        }}
        // providers={['apple', 'google', 'github']}
      />
    </>
  );
}
