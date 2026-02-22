// import {
//   reactExtension,
//   useSettings,
//   useLanguage,
//   View,
//   Grid,
//   Heading,
//   Text,
//   Image,
//   BlockSpacer,
// } from "@shopify/ui-extensions-react/checkout";
// import { InlineStack } from "@shopify/ui-extensions/checkout";

// // 1. Choose an extension target
// export default reactExtension("purchase.checkout.block.render", () => (
//   <Extension />
// ));

// function Extension() {
//   const settings = useSettings();
//   const language = useLanguage();
  
//   // Determine if German is the current language
//   const isGerman = language.isoCode.toLowerCase().startsWith('de');
  
//   // Use language-specific settings fields
//   const title = isGerman ? (settings.card_title_de || settings.card_title) : settings.card_title;
//   const text = isGerman ? (settings.card_text_de || settings.card_text) : settings.card_text;
  
//   return (
//     <>
//       <View 
//         padding="base" 
        
//         border="base"
//         radius="base"
//         status="info"
//       >
//         <Heading level="3">{title}</Heading>
//         <BlockSpacer />
//         <Grid 
//           columns={["90%", "10%"]}
//           spacing="base"
//         >
//           <Text>{text}</Text>
//           <Image 
//             source={settings.card_img_url}
//             alt={title}
//           />
//         </Grid>
//       </View>
//     </>
//   );
// }

import {
  reactExtension,
  useSettings,
  useLanguage,
  View,
  Grid,
  Heading,
  Image,
  BlockSpacer,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const settings = useSettings();
  const language = useLanguage();
  
  const isGerman = language.isoCode.toLowerCase().startsWith('de');
  
  const title = isGerman ? (settings.card_title_de || settings.card_title) : settings.card_title;
  const text = isGerman ? (settings.card_text_de || settings.card_text) : settings.card_text;
  
  return (
    <View 
      padding="base" 
      border="base"
      radius="base"
      status="info"
    >
      <Heading level="3">{title}</Heading>
      <BlockSpacer />
      <Grid 
        columns={["90%", "10%"]}
        spacing="base"
      >
        <View>
          <ParsedText text={text} />
        </View>
        <Image 
          source={settings.card_img_url}
          alt={title}
        />
      </Grid>
    </View>
  );
}

// Component to parse and render text with links using Polaris Web Components
function ParsedText({ text }) {
  if (!text) return null;

  // Regular expression to match <a> tags
  const linkRegex = /<a\s+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/g;
  
  // Check if there are any links in the text
  if (!linkRegex.test(text)) {
    // No links found, render as plain text using dangerouslySetInnerHTML
    return <s-text dangerouslySetInnerHTML={{ __html: text }} />;
  }

  // Reset regex lastIndex
  linkRegex.lastIndex = 0;
  
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, href, linkText] = match;
    const matchStart = match.index;

    // Add text before the link
    if (matchStart > lastIndex) {
      const textBefore = text.substring(lastIndex, matchStart);
      parts.push({
        type: 'text',
        content: textBefore,
        key: `text-${lastIndex}`,
      });
    }

    // Add the link
    parts.push({
      type: 'link',
      href: href,
      content: linkText,
      key: `link-${matchStart}`,
    });

    lastIndex = matchStart + fullMatch.length;
  }

  // Add any remaining text after the last link
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex),
      key: `text-${lastIndex}`,
    });
  }

  // Render the parts using Polaris Web Components
  return (
    <s-inline-layout spacing="none">
      {parts.map((part) => {
        if (part.type === 'text') {
          return <s-text key={part.key}>{part.content}</s-text>;
        } else {
          return <s-link key={part.key} to={part.href}>{part.content}</s-link>;
        }
      })}
    </s-inline-layout>
  );
}