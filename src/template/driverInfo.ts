
export function driverInfoTemplate (order, driver) {
  const template = {
    type: 'flex',
    altText: 'คนขับของคุณ',
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
                    text: `${order.price} บาท`,
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
              label: 'ยกเลิก',
              data: `CANCEL${order._id}`
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
