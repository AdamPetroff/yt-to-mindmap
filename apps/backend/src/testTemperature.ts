import { getResponseFromGPT4 } from "./gpt4";
import fs from "fs";

const transcript = [
  {
    text: "radex themes is a set of professionally",
    start: 1.56,
    duration: 5,
  },
  {
    text: "designed UI components for react it has",
    start: 3.8,
    duration: 6,
  },
  {
    text: "tables and forms dropdowns and dialogues",
    start: 6.56,
    duration: 4.52,
  },
  {
    text: "everything you would need to build a",
    start: 9.8,
    duration: 3.24,
  },
  {
    text: "complete front end for a real world",
    start: 11.08,
    duration: 3.92,
  },
  {
    text: "application but what's really cool about",
    start: 13.04,
    duration: 4.159,
  },
  {
    text: "it is how easy it is to customize the",
    start: 15,
    duration: 4.279,
  },
  {
    text: "theme of these components changing their",
    start: 17.199,
    duration: 3.681,
  },
  {
    text: "look and feel to match your",
    start: 19.279,
    duration: 4.121,
  },
  {
    text: "application's brand or style let me show",
    start: 20.88,
    duration: 4.639,
  },
  {
    text: "you what I mean here's a screen built",
    start: 23.4,
    duration: 4.08,
  },
  {
    text: "entirely with components from radx",
    start: 25.519,
    duration: 4.481,
  },
  {
    text: "themes and it looks great but everything",
    start: 27.48,
    duration: 4.88,
  },
  {
    text: "here is using the default theme values",
    start: 30,
    duration: 4.2,
  },
  {
    text: "let's make some changes I'll come over",
    start: 32.36,
    duration: 3.64,
  },
  {
    text: "here to the root of my app and find this",
    start: 34.2,
    duration: 3.76,
  },
  {
    text: "single theme component which lets us",
    start: 36,
    duration: 4.6,
  },
  {
    text: "customize the theme let's start with the",
    start: 37.96,
    duration: 5.4,
  },
  {
    text: "accent color prop and for this demo I'm",
    start: 40.6,
    duration: 5.799,
  },
  {
    text: "going to choose green as soon as I save",
    start: 43.36,
    duration: 5.519,
  },
  {
    text: "check this out not only have the button",
    start: 46.399,
    duration: 4.881,
  },
  {
    text: "and table colors been updated the focus",
    start: 48.879,
    duration: 5.601,
  },
  {
    text: "style of our input the hover active and",
    start: 51.28,
    duration: 5.759,
  },
  {
    text: "focus style of our button even the text",
    start: 54.48,
    duration: 4.84,
  },
  {
    text: "selection color and the placeholder for",
    start: 57.039,
    duration: 4.641,
  },
  {
    text: "our images have all been updated with",
    start: 59.32,
    duration: 4.36,
  },
  {
    text: "different shades of green without any",
    start: 61.68,
    duration: 3.52,
  },
  {
    text: "other",
    start: 63.68,
    duration: 3.92,
  },
  {
    text: "changes now let's come and change the",
    start: 65.2,
    duration: 4.32,
  },
  {
    text: "appearance of the app this is currently",
    start: 67.6,
    duration: 3.36,
  },
  {
    text: "a lighter app but if we set the",
    start: 69.52,
    duration: 3.68,
  },
  {
    text: "appearance to dark we now have a",
    start: 70.96,
    duration: 4.519,
  },
  {
    text: "beautiful dark green background and new",
    start: 73.2,
    duration: 4.8,
  },
  {
    text: "shades of our green accent and even our",
    start: 75.479,
    duration: 4.521,
  },
  {
    text: "Grays that have been handpicked to look",
    start: 78,
    duration: 4.04,
  },
  {
    text: "great and have accessible contrast",
    start: 80,
    duration: 4.24,
  },
  {
    text: "ratios in a dark Mode",
    start: 82.04,
    duration: 5.84,
  },
  {
    text: "app let's also change the radius prop we",
    start: 84.24,
    duration: 5.72,
  },
  {
    text: "can see our options here and if we",
    start: 87.88,
    duration: 4.8,
  },
  {
    text: "choose none just like that our input",
    start: 89.96,
    duration: 5.32,
  },
  {
    text: "button and avatars have all updated but",
    start: 92.68,
    duration: 4.88,
  },
  {
    text: "not only that if we open the dialogue",
    start: 95.28,
    duration: 4.04,
  },
  {
    text: "we'll see our modal treatment and all",
    start: 97.56,
    duration: 3.8,
  },
  {
    text: "these form controls have square corners",
    start: 99.32,
    duration: 4.479,
  },
  {
    text: "as well the full option gives us this",
    start: 101.36,
    duration: 5,
  },
  {
    text: "friendly pill treatment but for this app",
    start: 103.799,
    duration: 4.121,
  },
  {
    text: "let's go with",
    start: 106.36,
    duration: 5.399,
  },
  {
    text: "small and I think this looks great so",
    start: 107.92,
    duration: 6.239,
  },
  {
    text: "each component in radex themes deres its",
    start: 111.759,
    duration: 4.521,
  },
  {
    text: "look and feel from this single theme",
    start: 114.159,
    duration: 4.121,
  },
  {
    text: "component and they've all been designed",
    start: 116.28,
    duration: 4.04,
  },
  {
    text: "to work beautifully together no matter",
    start: 118.28,
    duration: 4.439,
  },
  {
    text: "what theme you're using now this screen",
    start: 120.32,
    duration: 4.52,
  },
  {
    text: "only uses a subset of radex themes",
    start: 122.719,
    duration: 4.641,
  },
  {
    text: "components but check this out all of",
    start: 124.84,
    duration: 4.279,
  },
  {
    text: "these examples are built with radex",
    start: 127.36,
    duration: 4.56,
  },
  {
    text: "themes components meaning all the colors",
    start: 129.119,
    duration: 5.361,
  },
  {
    text: "spacing and typography are being driven",
    start: 131.92,
    duration: 5.2,
  },
  {
    text: "from a single customized theme there's",
    start: 134.48,
    duration: 4.32,
  },
  {
    text: "even this playground that shows off",
    start: 137.12,
    duration: 3.92,
  },
  {
    text: "every component in the library and how",
    start: 138.8,
    duration: 4.799,
  },
  {
    text: "each one responds to your",
    start: 141.04,
    duration: 4.96,
  },
  {
    text: "theme and check out some of these design",
    start: 143.599,
    duration: 4.801,
  },
  {
    text: "details the smaller border radius of",
    start: 146,
    duration: 4.64,
  },
  {
    text: "these inputs pair nicely with a larger",
    start: 148.4,
    duration: 4.24,
  },
  {
    text: "radius on the modal there's extra",
    start: 150.64,
    duration: 3.92,
  },
  {
    text: "padding on these ghost variants to make",
    start: 152.64,
    duration: 3.48,
  },
  {
    text: "sure they always align with their",
    start: 154.56,
    duration: 3.84,
  },
  {
    text: "surrounding contents and there's even",
    start: 156.12,
    duration: 4.08,
  },
  {
    text: "this background setting you can use to",
    start: 158.4,
    duration: 3.72,
  },
  {
    text: "give your cards and dialogues this",
    start: 160.2,
    duration: 5.399,
  },
  {
    text: "really slick translucent treatment so if",
    start: 162.12,
    duration: 4.96,
  },
  {
    text: "you've ever wanted to use beautiful",
    start: 165.599,
    duration: 3.681,
  },
  {
    text: "components from a UI library but had a",
    start: 167.08,
    duration: 4.28,
  },
  {
    text: "hard time customizing them to match your",
    start: 169.28,
    duration: 4.959,
  },
  {
    text: "brand or style radex themes was made for",
    start: 171.36,
    duration: 6.72,
  },
  {
    text: "you check out rui.com to learn more or",
    start: 174.239,
    duration: 6.281,
  },
  {
    text: "to get started building your next",
    start: 178.08,
    duration: 11.159,
  },
  {
    text: "[Music]",
    start: 180.52,
    duration: 11.719,
  },
  {
    text: "stop",
    start: 189.239,
    duration: 3,
  },
];
const taskDef1 = `Provide a JSON Object that will be used for creation of a mind map`;
const taskDefDescription2 = `The given input will be transcript for a video in the form of an array of objects with properties "txt" (text), and "t" (timestamp). Provide a JSON structure according to the following typescript structure: type Node = { title: string; description: string, t: number, children?: Node[] }. The description should include all the important information discussed about the particular topic. Ensure that the structure is as detailed as possible, extensively covering all mentioned information, including specific steps, methods, instructions, or guidelines cited in the text. Ensure to use multiple levels of nesting for breakdown of main topics, subtopics, and detailed elements or steps found within those subtopics. Avoid omitting any part of the text, paying particular attention to sequences, protocols, and specific directions or processes mentioned in the text. The JSON structure should be an object (not array) which is the main Node object which will include all the children.`;

async function createResult(temp: number) {
  return await getResponseFromGPT4({
    temperature: temp,
    messages: [{ role: "user", content: JSON.stringify(transcript) }],
    fcDescription: taskDef1,
    jsonPropDescription: taskDefDescription2,
  });
}

export default function testTemperatures() {
  const temps = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

  temps.forEach(async (temp) => {
    try {
      const result = await createResult(temp);

      fs.writeFileSync(
        `./temp/${temp}.json`,
        JSON.stringify(result.parsedJson)
      );
      console.log(`temp: ${temp} done`);
    } catch (e) {
      console.log(e.message);
    }
  });
}
