
import { useState } from 'react';
import { Container, Box, TabLink } from './styled'
import { Income } from './income';
import { Expenses } from './expenses';
import TransactionsList from 'components/TransactionsList/TransactionsList';


export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  //  Functions to handle Tab Switching
  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab('tab1');
  };
  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab('tab2');
  };
  return (
    <Container>
      <Box>
        <TabLink
          className={activeTab === 'tab1' ? 'active' : ''}
          onClick={handleTab1}
        >
          Expenses
        </TabLink>
        <TabLink
          className={activeTab === 'tab2' ? 'active' : ''}
          onClick={handleTab2}
        >
          income
        </TabLink>
      </Box>

      <div className="outlet">
        {activeTab === "tab1" ?
          <TransactionsList type='expense'/>
          :
          <TransactionsList type='income'/>}
      </div>
    </Container>
  );
};
