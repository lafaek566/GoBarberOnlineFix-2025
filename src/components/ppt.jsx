import React from "react";
import PptxGenJS from "pptxgenjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaDownload } from "react-icons/fa";

const GeneratePPT = () => {
  const createPPT = () => {
    let pptx = new PptxGenJS();

    // Cover Slide
    let slide1 = pptx.addSlide();
    slide1.addText(
      "PENGEMBANGAN APLIKASI PENCARIAN DAN PEMESANAN LAYANAN BARBERSHOP BERBASIS WEB",
      {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 1,
        fontSize: 24,
        bold: true,
        color: "gold",
        align: "center",
      }
    );
    slide1.addText("Dengan Algoritma Haversine Formula", {
      x: 1,
      y: 2.5,
      w: 8,
      h: 1,
      fontSize: 18,
      color: "white",
      align: "center",
    });
    slide1.background = { fill: "#222" };

    // Slide Cara Download dan Menjalankan Aplikasi
    let slide2 = pptx.addSlide();
    slide2.addText("Cara Download dan Menjalankan Aplikasi", {
      x: 0.5,
      y: 0.5,
      fontSize: 20,
      bold: true,
      color: "gold",
    });
    slide2.addText(
      "1. Clone repository: git clone https://github.com/username/repo.git\n" +
        "2. Masuk ke direktori proyek: cd repo\n" +
        "3. Install dependencies: npm install\n" +
        "4. Jalankan aplikasi: npm start\n",
      { x: 0.5, y: 1.2, w: 9, fontSize: 16, color: "white" }
    );
    slide2.background = { fill: "#222" };

    // Download PPT
    pptx.writeFile("Aplikasi_Barbershop.pptx");
  };

  return (
    <Card className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <CardContent className="flex flex-col items-center text-center">
        <h2 className="text-xl font-bold text-gold mb-4">
          Download Presentasi Barbershop
        </h2>
        <Button
          onClick={createPPT}
          className="bg-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center"
        >
          <FaDownload className="mr-2" /> Download PPT
        </Button>
      </CardContent>
    </Card>
  );
};

export default GeneratePPT;
