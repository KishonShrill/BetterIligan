import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";

// Adjust these paths depending on where you place this script
import { allServices } from "@/data/services";
import { getCategoryStyles } from "@/lib/utils";

const SIZE = { width: 1200, height: 630 };

async function generateImages() {
  // 1. Setup output directory: public/images/opengraph-image
  const outDir = path.join(
    process.cwd(),
    "public",
    "images",
    "opengraph-image",
  );
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 2. Check for the --force flag
  const isForce = process.argv.includes("--force");
  const isCheck = process.argv.includes("--check"); // New flag for Husky

  // Track if any new images are generated during this run
  let newlyGeneratedCount = 0;

  // 3. Load Font File (Satori cannot use standard web fonts, it needs a buffer)
  const boldFontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Inter",
    "Inter_28pt-ExtraBold.ttf",
  );
  const semiBoldFontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Inter",
    "Inter_24pt-SemiBold.ttf",
  );

  let boldFontData, semiBoldFontData;
  try {
    boldFontData = fs.readFileSync(boldFontPath);
    semiBoldFontData = fs.readFileSync(semiBoldFontPath);
  } catch (e) {
    console.error("❌ Error: You must provide valid static .ttf font files.");
    process.exit(1);
  }

  console.log(
    `Starting OG Image Generation... (Force: ${isForce}, Check: ${isCheck})`,
  );

  // 4. Loop through all services
  for (const service of allServices) {
    if (service.type !== "standard") continue;

    const slug = service.slug;
    const fileName = `${slug}.webp`; // Saving as WebP for optimal size/quality
    const filePath = path.join(outDir, fileName);

    // Skip if the file already exists and we aren't forcing it
    if (fs.existsSync(filePath) && !isForce) {
      console.log(`⏭️  Skipping ${fileName} (Already exists)`);
      continue;
    }

    console.log(`🖼️  Generating ${fileName}...`);

    newlyGeneratedCount++;
    const title = service.title || "Service Not Found";
    const category = service.category || "General";
    const colors = getCategoryStyles(category);

    // 5. Generate SVG with Satori using your exact JSX template
    const svg = await satori(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0038a8", // BetterGovPH blue background
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Top row: Logo Placeholder and Category Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
            }}
          >
            <img
              src="https://betteriligancity.org/icon.png"
              alt="BetterIliganCity logo"
              style={{ width: "64px", height: "64px", marginRight: 16 }}
            />
            BetterIliganCity
          </div>

          {/* Dynamic Category Pill */}
          <div style={{ display: "flex", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                padding: "8px 24px",
                backgroundColor: colors.bg,
                color: colors.text,
                borderRadius: "9999px",
                fontSize: "2.5rem",
                fontWeight: 600,
              }}
            >
              {category}
            </div>
          </div>
        </div>

        {/* Dynamic Title Section */}
        <div
          style={{
            display: "flex",
            fontSize: "5rem",
            fontWeight: 800,
            color: "white",
            marginTop: "auto",
            marginBottom: "40px",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {/* Footer / Department Info */}
        <div
          style={{
            display: "flex",
            fontSize: "2rem",
            color: "white",
            fontWeight: 500,
          }}
        >
          {`Provided by: ${service.department}`}
        </div>
      </div>,
      {
        ...SIZE,
        fonts: [
          {
            name: "sans-serif",
            data: semiBoldFontData,
            weight: 600, // Used for the pills and footer
            style: "normal",
          },
          {
            name: "sans-serif",
            data: boldFontData,
            weight: 800, // Used for the main title
            style: "normal",
          },
        ],
      },
    );

    // 6. Convert SVG to WebP and save using Sharp
    const webpBuffer = await sharp(Buffer.from(svg))
      .webp({ quality: 80 })
      .toBuffer();

    fs.writeFileSync(filePath, webpBuffer);
  }

  // Husky Pre-push Logic
  if (isCheck && newlyGeneratedCount > 0) {
    console.error(
      `\n❌ Git Push Aborted: ${newlyGeneratedCount} missing Open Graph image(s) were generated.`,
    );
    console.error(
      `Please commit the newly generated images in /public/images/opengraph-image/ before pushing.`,
    );
    process.exit(1); // Exiting with 1 tells Husky to stop the push
  } else {
    console.log("\n✅ Open Graph images are up to date!");
  }
}

generateImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
