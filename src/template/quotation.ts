function templateQuotation(order) {
  let template = {
    type: 'bubble',
    direction: 'ltr',
    header: {
      type: 'box',
      layout: 'vertical',
      flex: 0,
      spacing: 'none',
      margin: 'none',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: 'การเดินทางของคุณ',
              size: 'xl'
            }
          ]
        }
      ]
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'separator'
        },
        {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          margin: 'lg',
          action: {
            type: 'uri',
            uri: `${order.source.address}`
          },
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'ต้นทาง',
                  flex: 2,
                  size: 'sm',
                  color: '#AAAAAA'
                },
                {
                  type: 'text',
                  text: `${order.source.address}`,
                  flex: 4,
                  size: 'sm',
                  color: '#666666',
                  wrap: true
                },
                {
                  type: 'image',
                  url: 'https://azecomsa99.blob.core.windows.net/sims/common/google-maps.png'
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'ปลายทาง',
                  flex: 2,
                  size: 'sm',
                  color: '#AAAAAA'
                },
                {
                  type: 'text',
                  text: `${order.destination.address}`,
                  flex: 4,
                  size: 'sm',
                  color: '#666666',
                  wrap: true
                },
                {
                  type: 'image',
                  url: 'https://azecomsa99.blob.core.windows.net/sims/common/google-maps.png'
                }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'วัน / เวลา',
                  flex: 2,
                  size: 'sm',
                  color: '#AAAAAA'
                },
                {
                  type: 'text',
                  text: `${order.date / order.time}`,
                  flex: 5,
                  size: 'sm',
                  color: '#666666'
                }
              ]
            }
          ]
        },
        {
          type: 'separator',
          margin: 'lg'
        },
        {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          margin: 'lg',
          action: {
            type: 'uri',
            uri: 'https://www.google.com/maps/place/Mo+Chit/@13.8022907,100.5516423,17z/data=!3m1!4b1!4m5!3m4!1s0x30e29c407402e1f1:0x43e7df6aa354257f!8m2!3d13.8022855!4d100.553831'
          },
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'ประเภท',
                  flex: 2,
                  size: 'sm',
                  color: '#AAAAAA'
                },
                {
                  type: 'text',
                  text: `${order.pet_type}`,
                  flex: 5,
                  size: 'sm',
                  color: '#666666'
                }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'จำนวน',
                  flex: 2,
                  size: 'sm',
                  color: '#AAAAAA'
                },
                {
                  type: 'text',
                  text: `${order.qty}`,
                  flex: 5,
                  size: 'sm',
                  color: '#666666'
                }
              ]
            },
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'ขนาด',
                  flex: 2,
                  size: 'sm',
                  color: '#AAAAAA'
                },
                {
                  type: 'text',
                  text: `${order.sizes}`,
                  flex: 5,
                  size: 'sm',
                  color: '#666666'
                }
              ]
            }
          ]
        },
        {
          type: 'separator',
          margin: 'lg'
        },
        {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          margin: 'lg',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: 'เบอร์โทร',
                  flex: 2,
                  color: '#AAAAAA'
                },
                {
                  type: 'text',
                  text: `${order.customer.phone}`,
                  flex: 5,
                  size: 'sm',
                  color: '#666666'
                }
              ]
            }
          ]
        },
        {
          type: 'separator',
          margin: 'lg'
        }
      ]
    },
    footer: {
      type: 'box',
      layout: 'horizontal',
      flex: 2,
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'เสนอราคา',
            uri: 'https://linecorp.com'
          },
          color: '#00d5ca',
          height: 'sm',
          style: 'primary'
        },
        {
          type: 'spacer',
          size: 'sm'
        }
      ]
    }
  };
  return template;
}
