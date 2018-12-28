
export function confirmQuotation (order, driver) {
  const template = {
    type: 'bubble',
    hero: {
      type: 'image',
      url: `${driver.image}`,
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
      // action: {
      //   type: 'uri',
      //   label: 'Action',
      //   uri: 'https://linecorp.com'
      // }
    },
    body: {
      type: 'box',
      layout: 'vertical',
      spacing: 'md',
      action: {
        type: 'uri',
        label: 'Action',
        uri: 'https://linecorp.com'
      },
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
                  text: `${order.price}฿`,
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
            type: 'uri',
            label: 'รับข้อเสนอ',
            uri: 'https://linecorp.com'
          },
          flex: 2,
          color: '#00d5ca',
          style: 'primary'
        },
        {
          type: 'button',
          action: {
            type: 'uri',
            label: 'ปฏิเสธ',
            uri: 'https://linecorp.com'
          },
          flex: 2,
          color: '#808080',
          margin: 'md',
          style: 'primary'
        }
      ]
    }
  };
  return template;
}
