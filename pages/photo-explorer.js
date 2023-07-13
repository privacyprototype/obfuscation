import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/layout';
import Image from 'next/image';
import utilStyles from '../styles/utils.module.css';
import { useState, useEffect } from 'react';

const json = require('/public/sampleOCR.json');

// temporary!
/*var json = {
  "caption": "Test",
  "OCR": [],
  "unique_bboxes": [
    {
      "bbox": [
        111,
        349,
        840,
        256
      ],
      "caption": "a wallet with a credit card and a card holder"
    },
    {
      "bbox": [
        121,
        423,
        422,
        183
      ],
      "caption": "a close up of a beige leather wallet with a metal clasp"
    },
    {
      "bbox": [
        691,
        385,
        295,
        146
      ],
      "caption": "the jpmorgan chase black card"
    },
    {
      "bbox": [
        187,
        35,
        799,
        52
      ],
      "caption": "a blurry photo of a metal pipe with a hole in it"
    },
    {
      "bbox": [
        282,
        422,
        139,
        184
      ],
      "caption": "a close up of a purse with a metal clasp"
    }
  ],
  "private_bboxes": [
    {
      "id": 1,
      "caption": "the jpmorgan chase black card",
      "category": "credit card"
    }
  ],
  'originalWidth': 987,
  'originalHeight': 818
}*/

export default function PhotoExplorer() {
    const [overlay, setOverlay] = useState(<></>);
    const [caption, setCaption] = useState(json.caption);
    const newDim = 300;
    useEffect(() => {
    //  let ZingTouch = require('zingtouch');
    //  let imageRegion = document.body.getElementsByClassName(utilStyles.headingMd)[0];
    //   let zt = new ZingTouch.Region(imageRegion);
      let boxes = document.body.getElementsByClassName('box');
      for (let box of boxes) {
        box.ariaLabel = box.title;
        // zt.bind(box, 'tap', function(e) {
        //   setCaption(box.title);
        // });
      }
    }, [overlay]);

    useEffect(() => {
      let boxElements = [];
      let originalWidth = json['present']['dim'][0];
      let originalHeight = json['present']['dim'][1];
      
      json['original']['unique_bboxes'].forEach((box) => {
        let OCRText = "\n";
        json['present']['OCR'].forEach((OCRBox) => {
          let ocrC = OCRBox.boundingBox; // [x1,y1,x2,y2,x3,y3,x4,y4] where [top left, top right, bottom right, bottom left]
          let boxC = box.bbox; // [left, top, width, height]
          
          /* overlap detection:
            !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top); let r2 be OCR, r1 be box
          */
          let intersecting = !(ocrC[0] > boxC[0]+boxC[2] || ocrC[4] < boxC[0] || ocrC[1] > boxC[1]+boxC[3] || ocrC[5] < boxC[1]);
          if (intersecting) OCRText += `text: "${OCRBox.content}"\n`;
        });
        let boxDiv = (
          <Image
          className='box'
          src="/images/transparent.png"
          width={box.bbox[2]* newDim / originalWidth}
          height={box.bbox[3]* newDim / originalHeight}
          style={{
            position: 'absolute',
            left: box.bbox[0]*newDim / originalWidth,
            top: box.bbox[1]*newDim / originalHeight,
            width: box.bbox[2]*newDim / originalWidth,
            height: box.bbox[3]*newDim / originalHeight
          }}
          title={box.caption + OCRText}
          />);
        boxElements.push(boxDiv);
      });
      setOverlay(boxElements);
    }, []);

    return  (
      <Layout>
        <Head>
          <title>Photo Page</title>
        </Head>

        <div className={utilStyles.back}>
          <Link href="/photo-page">← Back</Link>
        </div>

        <header className={utilStyles.header}>
        <h1 className={utilStyles.headingm} aria-label="Explore objects and texts in the image by tapping different areas on the screen.">Photo Explorer</h1>
        </header>

        <div className={utilStyles.headingMd}>
          <div className='relativewrapper'>
            <Image
              priority
              src="./images/6.jpeg"
              width={newDim}
              height={newDim}
              alt="background"
              id='image_explore'
            //   aria-hidden = {true}
            />
            {overlay}
          </div>
          {caption}
        </div>

      </Layout>
    );
  }
