import { visit } from 'unist-util-visit';

/**
 * GFM only understands two checkbox states, `[ ]` and `[x]`, so an
 * "in progress" item has to be added on top of it. This plugin looks for
 * list items whose text opens with `[/]` (or `[-]`), strips that marker and
 * puts a `.task-progress` span in its place, so the item ends up shaped like
 * the checkbox items remark-gfm produces.
 *
 * Note this is not portable markdown: `- [/] ...` renders as literal text
 * anywhere that doesn't run this plugin, GitHub included.
 */

const MARKER = /^\[[-/]\](?=\s|$)/;

export default function rehypeTaskProgress() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'ul' && node.tagName !== 'ol') return;

      let converted = false;
      for (const item of node.children) {
        if (item.type === 'element' && item.tagName === 'li' && convert(item)) {
          converted = true;
        }
      }

      // A list of only in-progress items never gets the class from remark-gfm.
      if (converted) addClass(node, 'contains-task-list');
    });
  };
}

function convert(item) {
  const target = findMarkerText(item);
  if (!target || !MARKER.test(target.node.value)) return false;

  target.node.value = target.node.value.replace(MARKER, '');
  target.parent.children.splice(target.index, 0, {
    type: 'element',
    tagName: 'span',
    properties: {
      className: ['task-progress'],
      role: 'img',
      ariaLabel: 'In progress',
    },
    children: [],
  });
  addClass(item, 'task-list-item');
  return true;
}

/**
 * The marker sits in the item's first text node, which is a direct child in a
 * tight list but is wrapped in a `<p>` in a loose one.
 */
function findMarkerText(item) {
  let parent = item;

  while (parent) {
    const children = parent.children ?? [];
    const index = children.findIndex(
      (child) => child.type !== 'text' || child.value.trim() !== ''
    );
    if (index === -1) return null;

    const first = children[index];
    if (first.type === 'text') return { parent, index, node: first };
    if (first.type === 'element' && first.tagName === 'p') {
      parent = first;
      continue;
    }
    return null;
  }

  return null;
}

function addClass(node, name) {
  const properties = (node.properties ??= {});
  const current = properties.className;
  const classes = Array.isArray(current) ? current : current ? [current] : [];
  if (!classes.includes(name)) classes.push(name);
  properties.className = classes;
}
