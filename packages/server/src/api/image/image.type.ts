import { objectType } from 'nexus'
import { Image } from 'nexus-prisma'

export const ImageType = objectType({
  name: Image.$name,
  definition(t) {
    t.field(Image.id)
    t.field(Image.name)
    t.field(Image.url)
    t.field(Image.game)
    t.field(Image.secret)
    t.field(Image.size)
    t.field(Image.contentType)
  },
})
