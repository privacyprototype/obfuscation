import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/layout';
import Image from 'next/image';
import utilStyles from '../styles/utils.module.css';
import { useState, useEffect } from 'react'

// temporary!
var json = {
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
  "private_bboxes": [],
  'originalWidth': 987,
  'originalHeight': 818
}
export default function FirstPost() {
    const [overlay, setOverlay] = useState(<></>);
    const [caption, setCaption] = useState('Overall Image Caption: ' + json.caption);
    const [showOverallCaption, setShowOverallCaption] = useState(true);

    useEffect(() => {
      let ZingTouch = require('zingtouch');
      let imageRegion = document.body.getElementsByClassName(utilStyles.headingMd)[0];
      let zt = new ZingTouch.Region(imageRegion);

      zt.bind(document.querySelector('#image_explore'), 'tap', function () {
        setShowOverallCaption(false);
        zt.unbind(document.querySelector('#image_explore'));
      });
      let boxDivElements = document.body.getElementsByClassName('box');
      for (let box of boxDivElements) {
        zt.bind(box, 'tap', function(e) {
          setCaption('Object Caption: ' + box.title);
        });
      }
    }, [overlay, showOverallCaption]);

    useEffect(() => {
      let boxElements = [];
      let originalWidth = json['originalWidth'];
      let originalHeight = json['originalHeight'];
      json['unique_bboxes'].forEach((box) => {
        let boxDiv = (
          <div
          className='box'
          style={{
            position: 'absolute',
            left: box.bbox[0]*300 / originalWidth,
            top: box.bbox[1]*300/ originalHeight,
            width: box.bbox[2]*300/ originalWidth,
            height: box.bbox[3]*300/ originalHeight
          }}
          title={box.caption}
          key={box.caption}
          ></div>);
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
          <Link href="/">← Back</Link>
        </div>

        <header className={utilStyles.header}>
        <h1 className={utilStyles.heading2Xl}>Photo 1</h1>
        </header>

        <div className={utilStyles.headingMd}>
          <h2 className={utilStyles.sectionHeading}>Explore Image</h2>
          <div className='relativewrapper'>
            <Image
              priority
              src="./images/1.jpeg"
              width={300}
              height={300}
              alt=""
              id='image_explore'
            />
            {!showOverallCaption && overlay}
          </div>
          {caption}
        </div>
        
        <div className={utilStyles.headingMd}>
          <h2 className={utilStyles.sectionHeading}>Edit Image</h2>
          <p className={utilStyles.bold}>Select things to hide</p>
          <select name="focus" id="focus">
             <option value="" selected="selected">Hide entire background</option>
          </select>
          <p className={utilStyles.bold}>Style </p>
          <select name="style" id="style">
             <option value="" selected="selected">Blur</option>
          </select>
          <p className={utilStyles.bold}> Shape </p>
          <select name="shape" id="shape">
             <option value="" selected="selected">exact</option>
          </select>

          <br></br>
          <br></br>
          <button type="button">Apply Edit</button>
          <button type="button">Review Image</button>
          <button type="button">Revert</button>
        </div>

        <div>
        <button type="button">Complete</button>
        </div>
       
      </Layout>
    );
  }
