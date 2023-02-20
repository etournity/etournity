import React from 'react'
import { ForceScroll, ForceScrollProps } from '.'
import { Story } from '@storybook/react'

export default {
  title: 'Components/UI/ForceScroll',
  component: ForceScroll,
}

interface CustomArgs extends ForceScrollProps {
  isLocked: boolean
  description: string
}

export const ExampleForceScroll: Story<CustomArgs> = () => (
  <div
    style={{
      height: '20vh',
      width: '5vw',
    }}
  >
    <ForceScroll onChange={console.log}>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Quisquam animi qui, harum aperiam perspiciatis illum eligendi
        exercitationem facere expedita, ex nostrum sed dolorem consequuntur
        corrupti delectus beatae quidem totam vero? Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Porro quae dicta eveniet placeat,
        voluptatem totam et eaque optio repellendus adipisci asperiores
        possimus, explicabo ullam nihil quo, aliquam facere? Omnis, quia. Lorem,
        ipsum dolor sit amet consectetur adipisicing elit. Nulla deleniti amet
        sunt quisquam dolor possimus, magni voluptates iste, quis id dolore,
        totam facere consectetur eius. Quam rerum aspernatur excepturi
        praesentium. Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Quidem amet modi ut quam quae quod? Optio nam tempora rem odit modi.
        Quod tenetur dolorum dicta? Minus iste a alias dolores? Lorem ipsum
        dolor, sit amet consectetur adipisicing elit. Excepturi quibusdam labore
        cumque amet magni, soluta illo eaque quaerat architecto aut quo alias
        reprehenderit similique quos at beatae, sint ipsum officiis.
      </div>
    </ForceScroll>
  </div>
)

ExampleForceScroll.args = {}
