import { h } from "@dotjs/framework";
import { useStore } from "../store";

export function VirtualList() {
  const itemHeight = 24;
  const visibleCount = 20;
  const largeList = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);
  const offset = useStore().scrollOffset || 0;

  function handleScroll(e: Event) {
    const scrollTop = (e.target as HTMLElement).scrollTop;
    useStore().setState({ scrollOffset: Math.floor(scrollTop / itemHeight) });
  }

  const start = offset;
  const end = Math.min(start + visibleCount, largeList.length);

  return h(
    "div",
    {
      style: {
        height: `${itemHeight * visibleCount}px`,
        overflowY: "auto",
        border: "1px solid #ccc",
      },
      onScroll: handleScroll,
    },
    [
      h(
        "ul",
        { style: { position: "relative", height: `${itemHeight * largeList.length}px` } },
        largeList.slice(start, end).map((item, i) =>
          h(
            "li",
            {
              style: {
                position: "absolute",
                top: `${(start + i) * itemHeight}px`,
                height: `${itemHeight}px`,
                left: 0,
                right: 0,
              },
            },
            item
          )
        )
      ),
    ]
  );
}