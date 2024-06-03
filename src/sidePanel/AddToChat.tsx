import { AttachmentIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { useConfig } from './ConfigContext';

export const AddToChat = () => {
  const { config, updateConfig } = useConfig();
  return (
    <Menu>
      <MenuButton
        aria-label="Settings"
        as={Button}
        background="var(--bg)"
        border="2px solid var(--text)"
        borderRadius={16}
        fontSize="md"
        fontWeight={800}
        m={0}
        ml={2}
        padding={config?.chatMode ? 2 : 0}
        paddingLeft={config?.chatMode ? 2 : 0}
        paddingRight={config?.chatMode ? 5 : '1px'}
        rightIcon={!config?.chatMode ? <AttachmentIcon color="var(--text)" fontSize="xl" marginRight="5px" /> : undefined}
        size="md"
        variant="outlined"
        color="var(--text)"
        zIndex={2}
      >
        {config?.chatMode}
      </MenuButton>
      <MenuList
        background="var(--active)"
        borderBottom="2px solid var(--text)"
        borderLeft="2px solid var(--text)"
        borderRight="2px solid var(--text)"
        borderTop="2px solid var(--text)"
        marginTop="1px"
        minWidth="110px"
        zIndex={4}
        p={0}
        style={{ right: '-5.1rem', bottom: '0.25rem', position: 'absolute' }}
      >
        <MenuItem
          _hover={{ background: 'var(--bg)' }}
          background={!config?.chatMode ? 'var(--bg)' : 'var(--bg)'}
          borderBottom="2px solid var(--text)"
          color="var(--text)"
          fontSize="md"
          fontWeight={800}
          onClick={() => updateConfig({ chatMode: undefined })}
        >
          chat
        </MenuItem>
        <MenuItem
          _hover={{ background: 'var(--bg)' }}
          background={config?.chatMode === 'page' ? 'var(--bg)' : 'var(--bg)'}
          borderBottom="2px solid var(--text)"
          color="var(--text)"
          fontSize="md"
          fontWeight={800}
          onClick={() => updateConfig({ chatMode: 'page' })}
        >
          page chat
        </MenuItem>
        <MenuItem
          _hover={{ background: 'var(--bg)' }}
          background={config?.chatMode === 'web' ? 'var(--bg)' : 'var(--bg)'}
          color="var(--text)"
          fontSize="md"
          fontWeight={800}
          onClick={() => updateConfig({ chatMode: 'web' })}
        >
          web chat
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
