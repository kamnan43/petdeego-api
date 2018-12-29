export function paymentTemplate(order, driver, paymentUrl) {
  let template = {
    type: 'bubble',
    hero: {
      type: 'image',
      url: `${driver.image}`,
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'fit',
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
            label: 'ชำระเงิน',
            uri: paymentUrl
          },
          color: '#57B846',
          style: 'primary'
        }
      ]
    }
  };

  return {
    type: 'flex',
    altText: 'ชำระเงิน',
    contents: template,
  };
}
