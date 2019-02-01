
export function driverInfoTemplate(order, driver) {
  const template = {
    type: 'flex',
    altText: 'คนขับของคุณ',
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: `เย่! มีผู้รับงานแล้ว`,
            size: 'lg',
          },
          {
            type: 'text',
            text: `นี่คือรายละเอียดคนขับของคุณ`,
            size: 'lg',
          }
        ]
      },
      hero: {
        type: 'image',
        url: `${driver.image}`,
        size: 'full',
        aspectRatio: '20:13',
        aspectMode: 'cover',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: `ชื่อ`,
                flex: 1,
                size: 'lg',
              },
              {
                type: 'text',
                text: `${driver.name}`,
                flex: 2,
                size: 'lg',
                weight: 'bold'
              }
            ]
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: `โทร`,
                flex: 1,
                size: 'lg',
              },
              {
                type: 'text',
                text: `${driver.tel}`,
                flex: 5,
                size: 'lg',
                weight: 'bold'
              },
              {
                type: 'icon',
                flex: 1,
                url: 'https://iconsplace.com/wp-content/uploads/_icons/000000/256/png/phone-icon-256.png',
              }
            ],
            action: {
              type: 'uri',
              label: 'โทร',
              uri: `tel:${driver.tel}`,
            },
          },
          {
            type: 'separator'
          },
        ]
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'spacer',
            size: 'sm'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: 'ปฏิเสธคนขับคนนี้',
              data: `REJECT_${order._id}_${driver._id}`
            },
            color: '#808080',
            margin: 'md',
            style: 'primary'
          },
          {
            type: 'button',
            action: {
              type: 'postback',
              label: 'ยกเลิกออร์เดอร์',
              data: `CANCEL_${order._id}`
            },
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
