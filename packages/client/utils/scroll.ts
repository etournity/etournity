export const scrollToElementId = (id: string, behaviour?: ScrollBehavior) => {
  if (document) {
    const scrollRef = document.getElementById(id)
    scrollRef?.scrollIntoView({
      behavior: behaviour ?? 'smooth',
      inline: 'end',
    })
  }
}
