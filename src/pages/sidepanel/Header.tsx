import logo from '@assets/img/header-levi.png';

import { Avatar, WindowHeader } from 'react95';

import { styled } from 'styled-components';

const HeaderContainer = styled.header`
    display: flex;
    align-items: center;
`;

const HeaderText = styled.h2`
    margin-left: 1rem;
`;

export const Header = () => (
    <WindowHeader>
        <HeaderContainer>
            <Avatar size={30} src={logo} square />
            <HeaderText>Dust Wipe Helper</HeaderText>
        </HeaderContainer>
    </WindowHeader>
);
