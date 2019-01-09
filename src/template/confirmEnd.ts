import { displayDatetime } from '../utils/datetime';

export function confirmEndTemplate(order) {
  let template = {
    type: 'flex',
    altText: 'ยืนยันการถึงที่หมาย',
    contents: {
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
                    text: `${order.source.address || '-'}`,
                    flex: 4,
                    size: 'sm',
                    color: '#666666',
                    wrap: true
                  },
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
                    text: `${order.destination.address || '-'}`,
                    flex: 4,
                    size: 'sm',
                    color: '#666666',
                    wrap: true
                  },
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
                    text: `${order.date ? displayDatetime(order.date) : '-'}`,
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
                    text: `${order.customer.phone || '-'}`,
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
                    text: `${order.price || '-'} บาท`,
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
                    text: 'ชำระ',
                    flex: 2,
                    color: '#AAAAAA'
                  },
                  {
                    type: 'text',
                    text: `${order.payment === 'cash' ? 'เงินสด' : 'Line Pay'}`,
                    flex: 5,
                    weight: 'bold',
                    size: 'xl',
                    color: '#666666'
                  }
                ]
              },
              {
                type: 'text',
                text: order.payment === 'cash' ? 'อย่าลืม!! รับชำระเป็นเงินสด' : 'อย่าลืม!! ตรวจสอบการชำระเงินผ่าน LINE Pay',
                color: '#AAAAAA',
                weight: 'bold',
              },
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
              type: 'postback',
              label: 'ยืนยันถึงที่หมาย (ได้รับเงินเรียบร้อยแล้ว)',
              data: `DROPOFF_${order._id}`
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
    }
  };

  return template;
}
