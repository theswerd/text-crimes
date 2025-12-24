import type { Metadata } from "next";
import {
  MARKS,
  imageToMarks,
  imageToMarksV2,
  BinaryImageData,
  GrayscaleImageData,
} from "./lib/unicode";
import imageData from "./image-data.json";
import demonImageData from "./demon-data.json";
import treeImageData from "./tree-data.json";
import sfV2Data from "./sf-v2-data.json";
import benV2Data from "./ben-v2-data.json";
import rickV2Data from "./rick-v2-data.json";
import sweeneyV2Data from "./sweeney-v2-data.json";
import dog2V2Data from "./dog2-v2-data.json";
import { CopyButton } from "./components/CopyButton";
import { CharacterCarousel } from "./components/CharacterCarousel";
import { SideText } from "./components/SideText";
import { BrowserWarning } from "./components/BrowserWarning";
import { Checkerboard } from "./components/Checkerboard";
import { InlineMark } from "./components/InlineMark";

const titleText = "Drawing with Zero-Width Characters";

const pageTitle = imageToMarks(imageData as BinaryImageData, titleText);

const dogImg = imageToMarks(imageData as BinaryImageData, "");

const demonImg = imageToMarks(demonImageData as BinaryImageData, "");

const treeImg = imageToMarks(treeImageData as BinaryImageData, "");

const sfV2Img = imageToMarksV2(sfV2Data as GrayscaleImageData, "");
const benV2Img = imageToMarksV2(benV2Data as GrayscaleImageData, "");
const rickV2Img = imageToMarksV2(rickV2Data as GrayscaleImageData, "");
const sweeneyV2Img = imageToMarksV2(sweeneyV2Data as GrayscaleImageData, "");
const dog2V2Img = imageToMarksV2(dog2V2Data as GrayscaleImageData, "");

const titleTreeImg = imageToMarks(treeImageData as BinaryImageData, titleText, {
  markClassName: "text-gray-200",
  skipChars: "' -",
});

export const metadata: Metadata = {
  title: pageTitle as string,
  verification: {
    google: "4mkggqWBj3nxBYJ7D0kPYnhAgiDO9DqrFyGSDJY5eBg",
  },
};

// Test data: simple alternating pattern
const testImageData: BinaryImageData = {
  width: 12,
  height: 40,
  aboveHeight: 20,
  belowHeight: 20,
  pixels: Array.from({ length: 12 }, (_, col) =>
    Array.from({ length: 40 }, (_, row) => (col + row) % 2)
  ),
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black w-screen overflow-clip relative">
      <BrowserWarning />
      <SideText side="left" />
      <SideText side="right" />
      <h1 className="text-2xl font-bold mb-2 px-12 pt-4">{titleTreeImg}</h1>
      <p className="text-zinc-500 mb-4 px-12">
        A set of 18 unicode characters generally only seen in the Qur'an broke
        my assumptions about text rendering
      </p>
      <div className="mx-12 mb-8 bg-zinc-100 rounded-lg h-[190px] sm:h-[240px] md:h-[380px] overflow-hidden flex items-end w-fit max-w-[calc(100%-6rem)]">
        <div
          className="text-[2px] sm:text-[2.4px] md:text-[4px] whitespace-nowrap"
          style={{ fontFamily: "var(--font-geist), sans-serif" }}
        >
          {sfV2Img}
        </div>
      </div>
      <p className="px-12">
        The image above is a single line of white spaces with a viewbox height of 3 pixels according to the browser. Using a set of unicode characters I can make images like that, and break other website's assumptions about where text should be {[..."rendered"].map((char, i) => (
          <span key={i} className="group/rendered">
            {char}
            {i % 2 === 0 && (
              <span className="text-gray-400 group-hover/rendered:text-red-500 transition-colors">
                {(MARKS.above.sadLamAlef.repeat(4) + MARKS.above.meemInitial.repeat(4)).repeat(2) + MARKS.above.sadLamAlef.repeat(4)}
              </span>
            )}
          </span>
        ))}.
      </p>
      <p className="px-12 mt-4">


        Months ago I found a twitter bio that had the strange effect of a giant
        lin{MARKS.above.lamAlef.repeat(50)}e coming out of one of the letters. I
        figured out it was based around the character{" "}
        <InlineMark>
          <span className="hidden">_</span>&#1751;
        </InlineMark>{" "}
        <i>AKA U+06D7 ARABIC LETTER ALEF WITH WAVY HAMZA ABOVE</i>. This
        character has a couple of unusual properties:
        <ul className="list-disc pl-5">
          <li>
            It&apos;s a zero-width character. It takes up no horizontal space,
            the characters after it do not move horizontally because of it.
            These are generally used as special formatting purposes. To turn
            text right to left you can use U+200F (<i>RIGHT-TO-LEFT MARK</i>)
            and U+200B (<i>ZERO WIDTH SPACE</i>) has famously caused programmers
            hell when it causes files to fail compiles for seemingly no reason.
          </li>
          <li>
            It&apos;s a combining mark. Rather than being a standalone
            character, it attaches to and modifies the preceding character.
            Common examples include accents like é (e + U+0301{" "}
            <i>COMBINING ACUTE ACCENT</i>), umlauts like ü (u + U+0308{" "}
            <i>COMBINING DIAERESIS</i>), and tildes like ñ (n + U+0303{" "}
            <i>COMBINING TILDE</i>). The base letter and its marks form what
            Unicode calls a &quot;grapheme cluster&quot; — what we perceive as a
            single character.
          </li>
          <li>
            It&apos;s stackable. When you place multiple combining marks next to
            each other, they don&apos;t overwrite — they stack vertically. Most
            combining marks can only be used one per base character: If I put
            100 U+0301 <i>COMBINING ACUTE ACCENT</i> after an &quot;e&quot;, I
            still just get an &quot;é&quot; with one accent. But with certain
            characters, including U+06D7 ARABIC LETTER ALEF WITH WAVY HAMZA
            ABOVE, you can stack multiple instances on top of each other,
            creating towers{MARKS.above.threeDots.repeat(50)}
          </li>
        </ul>
      </p>
      <br />
      <p className="px-12">
        After doing a review of unicode characters, I was able to find 19
        characters with these traits. 16 stacking upwards, 3 stacking downwards.
        After looking at them all (and asking ChatGPT), I realized they are all
        Arabic characters used in the Qur'an, referred to as Tajweed marks.
      </p>
      <br />
      <CharacterCarousel />
      <br />
      <br />
      <h2 className="px-12 text-2xl font-bold ">
        {MARKS.above.emptyCenterHigh.repeat(10) +
          MARKS.below.emptyCenter.repeat(10)}
        Combining Marks and Constructing Images/Patterns
        {MARKS.above.emptyCenterHigh.repeat(10) +
          MARKS.below.emptyCenter.repeat(10)}
      </h2>
      <br />

      <p className="px-12">
        These characters stack in two independent directions: the above marks
        and below marks. You can mix and match any of these marks together, and
        they&apos;ll continue to grow vertically until you add a non-combining
        character to reset the stack. This allows for some interesting effects,
        as you can create tall towers of marks both above and below a base
        character.
      </p>

      <div className="px-12 my-8 grid grid-cols-4 gap-8 text-4xl">
        <div className="text-center group cursor-pointer">
          <div className="mb-2">
            A
            <span className="text-red-500 opacity-40 group-hover:opacity-100 transition-opacity">
              {(
                MARKS.above.seen +
                MARKS.above.meemIsolated +
                MARKS.above.threeDots
              ).repeat(5)}
            </span>
          </div>
          <div className="text-sm text-red-500 opacity-40 group-hover:opacity-100 transition-opacity">
            seen + meemIsolated + threeDots
          </div>
        </div>
        <div className="text-center group cursor-pointer">
          <div className="mb-2">
            B
            <span className="text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity">
              {(
                MARKS.above.lamAlef +
                MARKS.above.jeem +
                MARKS.above.noon +
                MARKS.above.emptyCenterHigh
              ).repeat(4)}
            </span>
          </div>
          <div className="text-sm text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity">
            lamAlef + jeem + noon + emptyCenterHigh
          </div>
        </div>
        <div className="text-center group cursor-pointer">
          <div className="mb-2">
            C
            <span className="text-green-500 opacity-40 group-hover:opacity-100 transition-opacity">
              {MARKS.below.seen.repeat(7) + MARKS.below.lowMeem.repeat(7)}
            </span>
          </div>
          <div className="text-sm text-green-500 opacity-40 group-hover:opacity-100 transition-opacity">
            below: seen + lowMeem
          </div>
        </div>
        <div className="text-center group cursor-pointer">
          <div className="mb-2">
            D
            <span className="text-purple-500 opacity-40 group-hover:opacity-100 transition-opacity">
              {(MARKS.above.seen + MARKS.above.meemIsolated).repeat(5) +
                (MARKS.below.seen + MARKS.below.lowMeem).repeat(5)}
            </span>
          </div>
          <div className="text-sm text-purple-500 opacity-40 group-hover:opacity-100 transition-opacity">
            above + below combined
          </div>
        </div>
      </div>
      <br />

      <p className="px-12">
        As a series of unique characters, using the density of their coloring
        you can draw images or patterns with them using the same techniques as
        ASCII art. As a simple POC, I took two of the three characters that have
        an above and equivalent below mark that had approximately the same
        height —{" "}
        <InlineMark>{"-" + MARKS.above.seen + MARKS.below.seen}</InlineMark>{" "}
        (seen) and{" "}
        <InlineMark>
          {"-" + MARKS.above.meemIsolated + MARKS.below.lowMeem}
        </InlineMark>{" "}
        (meemIsolated/lowMeem) — and created a simple checkerboard pattern:
      </p>

      <div className="px-12 my-10 flex justify-center">
        <Checkerboard columns={20} height={4} />
      </div>
      <br />

      <p className="px-12">
        Based on this, I wrote a simple program to take images, turn them into
        black/white bitmaps, and convert those bitmaps into stacking marks.
      </p>

      <div className="px-12 mt-20 text-[6px] xs:text-[12px] sm:text-[16px]">
        <div
          className="flex justify-center"
          style={{
            fontFamily: "var(--font-geist), sans-serif",
          }}
        >
          {dogImg}
          <div className="w-8" />
          {demonImg}
          <div className="w-8" />
          {treeImg}
        </div>
        <div className="flex justify-center gap-8 mt-8 sm:mt-24 sm:gap-16">
          <img src="/image-preview.png" alt="Dog" className="h-10 sm:h-20" />
          <img src="/demon-preview.png" alt="Demon" className="h-10 sm:h-20" />
          <img src="/tree-preview.png" alt="Tree" className="h-10 sm:h-20" />
        </div>
      </div>
      <br />
      <p className="px-12">
        Once that worked, I wrote a new calibrator that incorporated all of the
        upwards marks and a new grayscale translator that lets me take any image
        and convert it into marks like these. Despite these strings having a
        length of thousands of characters and rendering to this, the dom
        registers their text as a series of empty spaces; these entire images
        are just a single line of text. If you're interested you can try the
        calibrator{" "}
        <a href="/calibrate" className="underline group">
          {[..."here"].map((char, i) => (
            <span key={i}>
              {char}
              <span className="text-blue-300 group-hover:text-blue-600 transition-colors">
                {(
                  MARKS.above.seen +
                  MARKS.above.meemIsolated +
                  MARKS.above.threeDots
                ).repeat(3)}
              </span>
            </span>
          ))}
        </a>
      </p>
      <div className="mx-12 mt-4 sm:mt-8 mb-8 inline-grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-zinc-100 rounded-lg flex items-end h-42 sm:h-50 overflow-clip w-fit ">
          <div
            className="text-[3.5px] sm:text-[4px]"
            style={{ fontFamily: "var(--font-geist), sans-serif" }}
          >
            {rickV2Img}
          </div>
        </div>
        <div className="bg-zinc-100 rounded-lg flex items-end h-42 sm:h-50 overflow-clip w-fit">
          <div
            className="text-[3.5px] sm:text-[4px]"
            style={{ fontFamily: "var(--font-geist), sans-serif" }}
          >
            {sweeneyV2Img}
          </div>
        </div>
        <div className="bg-zinc-100 rounded-lg flex items-end h-42 sm:h-50 overflow-clip w-fit">
          <div
            className="text-[3.5px] sm:text-[4px]"
            style={{ fontFamily: "var(--font-geist), sans-serif" }}
          >
            {dog2V2Img}
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2 px-12 ">
        Behavior Across Platforms
      </h2>
      <p className="px-12">
        <ul>
          <li>
            <h3 className="inline-block font-bold">Twitter</h3> I first noticed
            these characters rendering strangely on Twitter. Twitter has since
            patched their CSS to not let it work in all the places it used to,
            but it still messes with notifications recieved from users who have
            it in their bio. I've heard of it clipping/not clipping on lots of
            platforms, and I've personally seen the behavior change back and
            forth over time.
            <div className="flex gap-2 sm:gap-4 my-4">
              <img
                src="/twitter-bio.jpeg"
                alt="Twitter bio with stacking marks"
                className="rounded-lg h-32 sm:h-48 w-auto"
              />
              <img
                src="/twitter-notifications.jpeg"
                alt="Twitter notifications affected by stacking marks"
                className="rounded-lg h-32 sm:h-48 w-auto"
              />
              <img
                src="/twitter-sidebar.jpeg"
                alt="Twitter sidebar with stacking marks"
                className="rounded-lg h-32 sm:h-48 w-auto"
              />
            </div>
          </li>
          <li>
            <h3 className="inline-block font-bold">GitHub</h3> GitHub lets you
            write these everywhere, but generally clips them before they can
            overflow in weird ways. The most interesting behavior I found was in
            the repository list.
            <div className="flex gap-2 sm:gap-4 my-4">
              <img
                src="/github-in-repo.png"
                alt="GitHub in-repo view with stacking marks"
                className="rounded-lg h-32 sm:h-48 w-auto"
              />
              <img
                src="/github-repo-list.png"
                alt="GitHub repository list with stacking marks"
                className="rounded-lg h-32 sm:h-48 w-auto"
              />
            </div>
          </li>
          <li>
            <h3 className="inline-block font-bold">Google</h3> these seem to be
            fine on Google Search Results if you can get them in there. It
            doesn't show up on Safari Google or Safari in general for me.
            <div className="flex gap-2 sm:gap-4 mt-4">
              <img
                src="/google-bio.png"
                alt="Google search results with stacking marks"
                className="rounded-lg h-32 sm:h-48 w-auto"
              />
            </div>
          </li>
        </ul>
      </p>
      <h2 className="text-2xl font-bold my-4 px-12">
        Why this happens and why it only happens on some sites?
      </h2>
      <p className="px-12 mb-8">
        As extremely rare characters, many fonts just ignore them. Other
        font&apos;s like Verdana (the font hacker news uses) renders these
        characters inline/non vertically stacked. One of the unique properties
        about these is despite obviously taking up space, they don&apos;t modify
        the bounding box of the text they are attached to. While most text would
        be expected to expand/shape the bounding box around it, these marks are
        ignored by it. However it doesn&apos;t ignore them — when overflow is
        set to none or hidden the marks are clipped outside of the bounding box.
      </p>
      <div className="px-12">
        <div className="border rounded-md w-full h-18 border-dashed border-gray-400 flex items-center flex-row px-2 py-2">
          <div
            className="mb-[18px] text-[1.1px] bg-zink-100 h-18 flex items-end overflow-hidden rounded-md"
            style={{ fontFamily: "var(--font-geist), sans-serif" }}
          >
            {benV2Img}
          </div>
          <div className="pl-4 h-full">
            <div className=" flex-col hidden sm:flex">
              <span className="text-lg">Written by Benjamin Swerdlow</span>
              <span className="">
                Thank you for reading, I really enjoyed writing this. Source code is available <a href="https://github.com/theswerd/text-crimes" className="underline group">{[..."here"].map((char, i) => (
                  <span key={i}>
                    {char}
                    <span className="text-orange-400 group-hover:text-red-500 transition-colors">
                      {(MARKS.above.seen + MARKS.above.meemIsolated + MARKS.above.threeDots + MARKS.above.lamAlef + MARKS.above.jeem).repeat(2)}
                    </span>
                    <span className="text-yellow-400 group-hover:text-orange-500 transition-colors">
                      {(MARKS.below.seen + MARKS.below.lowMeem + MARKS.below.emptyCenter).repeat(3)}
                    </span>
                  </span>
                ))}</a>
              </span>
            </div>
          </div>
          <a
            href="https://x.com/benswerd"
            className="ml-auto px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @benswerd
          </a>
        </div>
      </div>
      <br />
    </main>
  );
}
