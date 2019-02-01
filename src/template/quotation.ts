import { displayDatetime } from '../utils/datetime';
import { getDirectionUrl, getDistance } from '../utils/googlemap';

export async function templateQuotation(order) {
  let petType = 'อื่นๆ';
  if (order.pet_type && order.pet_type.length) {
    petType = order.pet_type.map(element => {
      if (element === 'cat') {
        return 'แมว';
      } else if (element === 'dog') {
        return 'สุนัข';
      }
    }).join(', ');
  }

  const directionUrl = getDirectionUrl(`${order.source.lat},${order.source.lng}`, `${order.destination.lat},${order.destination.lng}`);
  const distance = await getDistance(`${order.source.lat},${order.source.lng}`, `${order.destination.lat},${order.destination.lng}`);

  let template = {
    type: 'flex',
    altText: '(ทดสอบระบบ)',
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
                // text: 'การเดินทางของคุณ (ทดสอบระบบ)',
                text: '(ทดสอบระบบ)',
                size: 'md'
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
                    flex: 5,
                    size: 'sm',
                    color: '#666666',
                    wrap: true
                  },
                ],
                action: {
                  type: 'uri',
                  label: 'แผนที่',
                  uri: `${directionUrl}`,
                },
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
                    flex: 5,
                    size: 'sm',
                    color: '#666666',
                    wrap: true
                  },
                ],
                action: {
                  type: 'uri',
                  label: 'แผนที่',
                  uri: `${directionUrl}`,
                },
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: 'ระยะทาง',
                    flex: 2,
                    size: 'sm',
                    color: '#AAAAAA'
                  },
                  {
                    type: 'text',
                    text: distance ? `${distance.text} (โดยประมาณ)` : 'N/A',
                    flex: 4,
                    size: 'sm',
                    color: '#666666',
                    wrap: true
                  },
                  {
                    type: 'icon',
                    url: 'https://azecomsa99.blob.core.windows.net/sims/common/google-maps.png',
                  }
                ],
                action: {
                  type: 'uri',
                  label: 'แผนที่',
                  uri: `${directionUrl}`,
                },
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
                    text: `${order.datetime ? displayDatetime(order.datetime) : '-'}`,
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
                    text: 'ยอดเงิน',
                    flex: 2,
                    size: 'sm',
                    color: '#AAAAAA'
                  },
                  {
                    type: 'text',
                    text: `${order.price} บาท`,
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
                    text: 'ชำระโดย',
                    flex: 2,
                    size: 'sm',
                    color: '#AAAAAA'
                  },
                  {
                    type: 'text',
                    text: `${order.payment === 'cash' ? 'เงินสด' : 'Line Pay'}`,
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
                    text: 'เจ้าของ',
                    flex: 2,
                    size: 'sm',
                    color: '#AAAAAA'
                  },
                  {
                    type: 'text',
                    text: `${order.owner ? 'เดินทางไปด้วย' : 'ไม่ได้ไปด้วย'}`,
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
                    text: 'ประเภท',
                    flex: 2,
                    size: 'sm',
                    color: '#AAAAAA'
                  },
                  {
                    type: 'text',
                    text: petType,
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
                    text: `${order.qty || 'ไม่ระบุ'}`,
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
                    text: `${order.sizes || '-'}`,
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
                    text: `${order.customer.phone || 'ไม่ระบุ'}`,
                    flex: 4,
                    size: 'sm',
                    color: '#666666'
                  },
                  {
                    type: 'icon',
                    url: 'https://iconsplace.com/wp-content/uploads/_icons/000000/256/png/phone-icon-256.png',
                  }
                ],
                action: {
                  type: 'uri',
                  label: 'โทร',
                  uri: `tel:${order.customer.phone}`,
                },
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
              type: 'postback',
              label: 'รับงาน',
              data: `ACCEPT_${order._id}`
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
