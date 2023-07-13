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
  "private_bboxes": [
    {
      "id": 1,
      "caption": "the jpmorgan chase black card",
      "category": "credit card"
    }
  ],
  'originalWidth': 987,
  'originalHeight': 818
}

const editOptionData = {
  "background":{
    "blur":['exact', 'bounding box'], 
    "black out":['exact', 'bounding box']
  },
  "foreground": {
    "blur":['exact', 'bounding box'],
    "black out":['exact', 'bounding box'],
    "erase": ['exact']
  }
};

export default function FirstPost() {
    const [overlay, setOverlay] = useState(<></>);
    const [caption, setCaption] = useState(json.caption);
    const [showOverallCaption, setShowOverallCaption] = useState(true);
    
    // ===== image editor code begins ===== //
    const [privObj, setPrivObj] = useState([]);
    const [selectedObj, setSelectedObj] = useState('');
    const [borf, setBorf] = useState('')
    const [style, setStyle] = useState('');
    const [shape, setShape] = useState('');
    const [resultImgPath, setResultImgPath] = useState('./images/6.jpeg') 

    useEffect(() => {
      setPrivObj(json['private_bboxes']) 
    }, []);

    const handleObjChange = (event) => {
      setSelectedObj(event.target.value);
      setStyle('');
      if (selectedObj === "background") {
        setBorf('background')
      } else {
        setBorf('foreground')
      }
    };

    const handleStyleChange = (event) => {
      setStyle(event.target.value);
      setShape('');
    };

    const handleShapeChange = (event) => {
      setShape(event.target.value);
    };

    const handleApplyEdit = (event) => {
      let ImgPath = '/images/' + 1 + '_' + shape.replace(/ /g,"_") + "_" + style.replace(/ /g,"_") + ".jpeg"
      setResultImgPath(ImgPath)
      // !! record result
    };

    const handleRevert = (event) => {
      setSelectedObj('')
      setStyle('')
      setShape('')
      setResultImgPath('./images/6.jpeg')
    };

    // const handleReviewImgError = (event) => {
    //   setResultImgPath('/images/1.jpeg')
    // };

    let styles = [];
    let shapes = [];
    if (borf === "background") {
      styles = Object.keys(editOptionData["background"]);
      shapes = style ? editOptionData["background"][style] : [];
    } 
    
    if (borf === "foreground") {
      styles = Object.keys(editOptionData["foreground"]);
      shapes = style ? editOptionData["foreground"][style] : [];
    }
 
    // ===== image editor code ends ===== //

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
          box.ariaLabel = caption
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
        <h1 aria-label="Photo 1" className={utilStyles.heading2Xl}>Photo 1</h1>
        </header>

        <div className={utilStyles.headingMd}>
          <h2 className={utilStyles.sectionHeading}>Explore Image</h2>
          <div className='relativewrapper'>
            <Image
              priority
              src="./images/6.jpeg"
              width={300}
              height={300}
              alt={caption}
              id='image_explore'
              accessible={false} 
            />
            {/* {caption} */}
          </div>
          
          <Link href="/photo-explorer">Explore what's in the image</Link>
        </div>

        {/* ===== image editor code begins ===== */} 
        <div className={utilStyles.headingMd}>
          <h2 className={utilStyles.sectionHeading}>Edit Image</h2>
          Item to hide: <select value={selectedObj} onChange={handleObjChange}>
            <option value="">Select a potential private item to hide</option>
            {privObj.map((item) =>(
              <option key={item.id} value={item.id}>
                {item.caption}
              </option>
            ))}
            <option value="background">Entire background</option>
          </select>
          <br></br>
          Style: <select value={style} onChange={handleStyleChange}>
            <option value="">Select the hidding style</option>
            {styles.map((style) =>(
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          <br></br>
          Shape: <select value={shape} onChange={handleShapeChange}>
            <option value="">Select the shape to hide</option>
            {shapes.map((shape) =>(
              <option key={shape} value={shape}>
               {shape}
              </option>
            ))}
          </select>

          <br></br>
          <br></br>
          <button onClick={handleApplyEdit}>Apply Edit</button>
          <br></br>
          <button onClick={handleRevert}>Revert</button>
        </div>

        <div className={utilStyles.headingMd}>
          <h2 className={utilStyles.sectionHeading}>Review Edited Image</h2>
          <div className='relativewrapper'>
            <Image
              // onError={handleReviewImgError}
              priority
              src={resultImgPath}
              width={300}
              height={300}
              alt={caption}
              id='image_review'
              accessible={true} 
            />
            {/* {overlay} */}
          </div>
          {/* {caption} */}
        </div>

        <div>
        <button type="button">Complete and submit</button>
        </div>
        {/* ===== image editor code ends ===== */} 

      </Layout>
    );
  }
