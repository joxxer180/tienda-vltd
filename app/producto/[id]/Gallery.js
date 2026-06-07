'use client'

import { useState } from 'react'

export default function Gallery({ images, productName }) {
  const [current, setCurrent] = useState(0)

  function nextImage() {
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  function prevImage() {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  return (
    <div>
      <div
        style={{
          position: 'relative',
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        <img
          src={images[current]}
          alt={productName}
          style={{
            width: '100%',
            maxHeight: '600px',
            objectFit: 'contain',
            borderRadius: '10px'
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '10px'
              }}
            >
              ◀️
            </button>

            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '10px'
              }}
            >
              ▶️
            </button>
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '15px',
          justifyContent: 'center'
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            onClick={() => setCurrent(index)}
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'cover',
              cursor: 'pointer',
              border:
                current === index
                  ? '3px solid black'
                  : '1px solid #ddd',
              borderRadius: '6px'
            }}
          />
        ))}
      </div>
    </div>
  )
}