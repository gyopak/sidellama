import { toPng } from 'html-to-image';

export const downloadText = (messages: string[]) => {
  if (messages.length === 0) return;
  const currentMessages = messages.map((m, i) => ({
    content: m,
    role: i % 2 === 0 ? 'LLAMA' : 'USER'
  })).reverse();
  const text = currentMessages.map(m => `${m.role}\n${m.content}`).join('\n\n');

  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  const filename = `chat_${(new Date().toJSON().slice(0,10))}.txt`
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const downloadJson = (messages: string[]) => {
  if (messages.length === 0) return;
  const currentMessages = messages.map((m, i) => ({
    content: m,
    role: i % 2 === 0 ? 'assistant' : 'user'
  })).reverse();
  const text = JSON.stringify(currentMessages, null, 2);

  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
  const filename = `chat_${(new Date().toJSON().slice(0,10))}.json`
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const downloadImage = (messages: string[]) => {
  if (!messages.length) return;
  const nodes = document.querySelectorAll('.chatMessage');
  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column-reverse';
  wrapper.style.paddingBottom = '1rem';
  wrapper.style.marginRight = '-2rem';
  wrapper.style.background = document.documentElement.style.getPropertyValue('--bg');

  nodes.forEach(n => {
    const cloned = n.cloneNode(true);

    // @ts-ignore-next-line
    cloned.style.marginTop = '1rem';
    wrapper.appendChild(cloned);
  });

  function filter(node) {
    const isIcon = node?.className?.includes?.('chakra-button');
    return (!isIcon);
  }

  document.body.appendChild(wrapper);

  nodes && toPng(wrapper, {
    filter,
    pixelRatio: 4,
    style: { flexGrow: 'unset' },
    backgroundColor: document.documentElement.style.getPropertyValue('--bg')
  })
    .then(dataUrl => {
      const img = new Image();
      img.src = dataUrl;
      const element = document.createElement('a');
      element.setAttribute('href', dataUrl);
      const filename = `chat_${(new Date().toJSON().slice(0,10))}.png`
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      document.body.removeChild(wrapper);
    })
    .catch(error => {
      console.error('oops, something went wrong!', error);
    });
};
