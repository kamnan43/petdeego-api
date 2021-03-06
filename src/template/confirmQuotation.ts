
export function confirmQuotation (order, driver, quotation) {
  const template = {
    type: 'flex',
    altText: 'ข้อเสนอราคานัดหมายของคุณ',
    contents: {
      type: 'bubble',
      hero: {
        type: 'image',
        url: `${driver.image}`,
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'fit',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'text',
            text: `${driver.name}`,
            size: 'lg',
            weight: 'bold'
          },
          {
            type: 'separator'
          },
          {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: `${quotation.price} บาท`,
                    margin: 'sm',
                    size: 'xxl',
                    align: 'center',
                    weight: 'bold',
                    color: '#57B846'
                  }
                ]
              }
            ]
          }
        ]
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'spacer',
            size: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: 'รับข้อเสนอ',
              data: `BUY_${quotation._id}`
            },
            flex: 2,
            color: '#00d5ca',
            style: 'primary'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: 'ปฏิเสธ',
              data:  `NOTBUY_${quotation._id}`
            },
            flex: 2,
            color: '#808080',
            margin: 'md',
            style: 'primary'
          }
        ]
      }
    }
  };
  return template;
}
