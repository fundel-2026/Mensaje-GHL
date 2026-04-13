import { useState } from 'react';
import ConversationList from './components/ConversationList';
import ChatView from './components/ChatView';

function App() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar with conversations */}
      <ConversationList
        onSelectContact={handleSelectContact}
        selectedContactId={selectedContact?.id}
      />

      {/* Chat area */}
      <ChatView
        key={refreshKey}
        contactId={selectedContact?.id}
        contact={selectedContact}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

export default App;
