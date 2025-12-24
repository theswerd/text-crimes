import type { Metadata } from "next";
import { MARKS, imageToMarks, BinaryImageData } from "./lib/unicode";
import imageData from "./image-data.json";
import demonImageData from "./demon-data.json";
import treeImageData from "./tree-data.json";
import { CopyButton } from "./components/CopyButton";
import { CharacterCarousel } from "./components/CharacterCarousel";
import { SideText } from "./components/SideText";
import { BrowserWarning } from "./components/BrowserWarning";
import { Checkerboard } from "./components/Checkerboard";
import { InlineMark } from "./components/InlineMark";

const titleText = "Stacking Non-Spaced Qur'anic Characters to Commit Text Crimes";

const pageTitle = imageToMarks(
  imageData as BinaryImageData,
  titleText
);

const dogImg = imageToMarks(
  imageData as BinaryImageData,
  ""
);

const demonImg = imageToMarks(
  demonImageData as BinaryImageData,
  ""
);

const treeImg = imageToMarks(
  treeImageData as BinaryImageData,
  ""
);

const titleTreeImg = imageToMarks(
  treeImageData as BinaryImageData,
  titleText,
  { markClassName: "text-gray-200", skipChars: "' -" }
);

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
      <h1 className="text-2xl font-bold mb-2 px-12 pt-4">
        {titleTreeImg}
      </h1>
      <p className="text-zinc-500 mb-4 px-12">
        A set of 18 unicode characters generally only seen in the Qur'an
        broke my assumptions about text rendering
      </p>
      <div className="mx-12 mb-8 bg-zinc-200 rounded-lg inline-block max-w-[calc(100%-2rem)]">
        <img
          src="/header.png"
          alt="Header"
          className="rounded-lg max-w-4xl w-full"
        />
      </div>
      <p className="px-12">
        Months ago I found a twitter bio that had the strange effect of a giant
        lin{MARKS.above.lamAlef.repeat(50)}e coming out of one of the letters. I
        figured out it was based around the character{" "}
        <InlineMark><span className="hidden">_</span>&#1751;</InlineMark>{" "}
        <i>AKA U+06D7 ARABIC LETTER ALEF WITH WAVY HAMZA ABOVE</i>. This
        character has a couple of unusual properties:
        <ul className="list-disc pl-5">
          <li>It&apos;s a zero-width character. It takes up no horizontal space, the characters after it do not move horizontally because of it. These are generally used as special formatting purposes. To turn text right to left you can use U+200F (<i>RIGHT-TO-LEFT MARK</i>) and U+200B (<i>ZERO WIDTH SPACE</i>) has famously caused programmers hell when it causes files to fail compiles for seemingly no reason.</li>
          <li>It&apos;s a combining mark. Rather than being a standalone character, it attaches to and modifies the preceding character. Common examples include accents like é (e + U+0301 <i>COMBINING ACUTE ACCENT</i>), umlauts like ü (u + U+0308 <i>COMBINING DIAERESIS</i>), and tildes like ñ (n + U+0303 <i>COMBINING TILDE</i>). The base letter and its marks form what Unicode calls a &quot;grapheme cluster&quot; — what we perceive as a single character.</li>
          <li>It&apos;s stackable. When you place multiple combining marks next to each other, they don&apos;t overwrite — they stack vertically. Most combining marks can only be used one per base character: If I put 100 U+0301 <i>COMBINING ACUTE ACCENT</i> after an &quot;e&quot;, I still just get an &quot;é&quot; with one accent. But with certain characters, including U+06D7 ARABIC LETTER ALEF WITH WAVY HAMZA ABOVE, you can stack multiple instances on top of each other, creating towers{MARKS.above.threeDots.repeat(50)}</li>
        </ul>
        
      </p>
      <br/>
      <p className="px-12">
        After doing a review of unicode characters, I was able to find 19 characters with these traits. 16 stacking upwards, 3 stacking downwards. After looking at them all (and asking ChatGPT), I realized they are all Arabic characters used in the Qur'an, referred to as Tajweed marks.
      </p>
      <br/>
      <CharacterCarousel />
    <br/>
    <br/>
      <h2 className="px-12 text-2xl font-bold ">{MARKS.above.emptyCenterHigh.repeat(10) + MARKS.below.emptyCenter.repeat(10)}Combining Marks and Constructing Images/Patterns{MARKS.above.emptyCenterHigh.repeat(10) + MARKS.below.emptyCenter.repeat(10)}</h2>
          <br/>

      <p className="px-12">
        These characters stack in two independent directions: the above marks and below marks. You can mix and match any of these marks together, and they&apos;ll continue to grow vertically until you add a non-combining character to reset the stack. This allows for some interesting effects, as you can create tall towers of marks both above and below a base character.
      </p>

      <div className="px-12 my-8 grid grid-cols-4 gap-8 text-4xl">
        <div className="text-center group cursor-pointer">
          <div className="mb-2">
            A<span className="text-red-500 opacity-40 group-hover:opacity-100 transition-opacity">{(MARKS.above.seen + MARKS.above.meemIsolated + MARKS.above.threeDots).repeat(5)}</span>
          </div>
          <div className="text-sm text-red-500 opacity-40 group-hover:opacity-100 transition-opacity">seen + meemIsolated + threeDots</div>
        </div>
        <div className="text-center group cursor-pointer">
          <div className="mb-2">
            B<span className="text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity">{(MARKS.above.lamAlef + MARKS.above.jeem + MARKS.above.noon + MARKS.above.emptyCenterHigh).repeat(4)}</span>
          </div>
          <div className="text-sm text-blue-500 opacity-40 group-hover:opacity-100 transition-opacity">lamAlef + jeem + noon + emptyCenterHigh</div>
        </div>
        <div className="text-center group cursor-pointer">
          <div className="mb-2">
            C<span className="text-green-500 opacity-40 group-hover:opacity-100 transition-opacity">{MARKS.below.seen.repeat(7) + MARKS.below.lowMeem.repeat(7)}</span>
          </div>
          <div className="text-sm text-green-500 opacity-40 group-hover:opacity-100 transition-opacity">below: seen + lowMeem</div>
        </div>
        <div className="text-center group cursor-pointer">
          <div className="mb-2">
            D<span className="text-purple-500 opacity-40 group-hover:opacity-100 transition-opacity">{(MARKS.above.seen + MARKS.above.meemIsolated).repeat(5) + (MARKS.below.seen + MARKS.below.lowMeem).repeat(5)}</span>
          </div>
          <div className="text-sm text-purple-500 opacity-40 group-hover:opacity-100 transition-opacity">above + below combined</div>
        </div>
      </div>
        <br/>

      <p className="px-12">
        As a series of unique characters, using the density of their coloring you can draw images or patterns with them using the same techniques as ASCII art. As a simple POC, I took two of the three characters that have an above and equivalent below mark that had approximately the same height — <InlineMark>{'-' + MARKS.above.seen + MARKS.below.seen}</InlineMark> (seen) and <InlineMark>{'-' + MARKS.above.meemIsolated + MARKS.below.lowMeem}</InlineMark> (meemIsolated/lowMeem) — and created a simple checkerboard pattern:
      </p>

      <div className="px-12 my-10 flex justify-center">
        <Checkerboard columns={20} height={4} />
      </div>
      <br/>
      
      <p className="px-12">
        Based on this, I wrote a simple program to take images, turn them into black/white bitmaps, and convert those bitmaps into stacking marks.
      </p>

      <div className="px-12 mt-20 text-[6px] xs:text-[12px] sm:text-[16px]">
        <div
          className="flex justify-center"
          style={{
            fontFamily: 'var(--font-geist), sans-serif',
          }}
        >
          {dogImg}
          <div className="w-8"/>
          {demonImg}
          <div className="w-8"/>
          {treeImg}
        </div>
        <div className="flex justify-center gap-8 mt-8 sm:mt-24 sm:gap-16">
          <img src="/image-preview.png" alt="Dog" className="h-10 sm:h-20" />
          <img src="/demon-preview.png" alt="Demon" className="h-10 sm:h-20" />
          <img src="/tree-preview.png" alt="Tree" className="h-10 sm:h-20" />
        </div>
      </div>
          <br/>
            <h1 className="text-2xl font-bold mb-2 px-12 ">
        Behavior Across Platforms and Browsers
      </h1>
      <p className="px-12 mb-20">
        <ul>
         <li><h3 className="inline-block font-bold">Twitter</h3> I first noticed these characters rendering strangely on Twitter. Twitter has since patched their CSS to not let it work in all the places it used to, but it still messes with notifications recieved from users who have it in their bio
          
        
          </li>
         </ul>
      </p>
      <br/>
    </main>
  );
}
