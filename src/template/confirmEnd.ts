function confirmEndTemplate(order) {
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
              text: 'Order',
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
                  text: 'ยอดเงิน',
                  flex: 2,
                  color: '#AAAAAA'
                },
                {
                  type: 'text',
                  text: `${order.price}฿`,
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
            label: 'ยืนยันถึงที่หมาย',
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