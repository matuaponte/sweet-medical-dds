import React from 'react';
import styled from 'styled-components';

const StyledArticle = styled.article`
  background: white;
  border: 2px solid #bac4c2;
  border-radius: 18px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  position: relative;
  overflow: hidden;
  gap: 20px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 100%;
    background: #087f73;
  }

  h3 {
    margin: 0;
    font-size: 18px;
    color: #0f172a;
  }

  p {
    margin: 4px 0 0;
    color: #64748b;
    font-size: 14px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const DoctorAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #e7f1ef;
  color: #087f73;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 18px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export default function BaseCard({ doctor, foto, infoSecundaria, children }) {
  return (
    <StyledArticle>
      <InfoContainer>
        <DoctorAvatar>
          {foto ? (
            <img src={foto} alt={doctor} />
          ) : (
            <span>{doctor?.slice(0, 2).toUpperCase()}</span>
          )}
        </DoctorAvatar>

        <div>
          <h3>{doctor}</h3>
          <p>{infoSecundaria}</p>
        </div>
      </InfoContainer>

      {/* Acá se inyectarán de forma dinámica los botones de cada pantalla */}
      <ActionsContainer>
        {children}
      </ActionsContainer>
    </StyledArticle>
  );
}