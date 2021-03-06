export default function SellerIcon({ filled, ...props }) {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        {filled ? (
          <>
            <g>
              <path d="M0,0h24v24H0V0z" fill="none" />
            </g>
            <g>
              <path d="M21.41,11.41l-8.83-8.83C12.21,2.21,11.7,2,11.17,2H4C2.9,2,2,2.9,2,4v7.17c0,0.53,0.21,1.04,0.59,1.41l8.83,8.83 c0.78,0.78,2.05,0.78,2.83,0l7.17-7.17C22.2,13.46,22.2,12.2,21.41,11.41z M6.5,8C5.67,8,5,7.33,5,6.5S5.67,5,6.5,5S8,5.67,8,6.5 S7.33,8,6.5,8z" />
            </g>
          </>
        ) : (
          <>
            <path d="M21.7583 11.1517L12.9283 2.32171C12.5583 1.95171 12.0483 1.74171 11.5183 1.74171L4.3483 1.74171C2.3483 1.74171 2.23604 1.74171 2.3483 3.74171L2.3483 10.9117C2.3483 11.4417 2.5583 11.9517 2.9383 12.3217L11.7683 21.1517C13 22.5 13 22.5 14.5983 21.1517L21.7683 13.9817C23 12.5 23 12.5 21.7583 11.1517ZM13 20.5L4 11.1517L4 3L11.7683 3.2254L21 12.3217L13 20.5Z" />
            <path d="M6.51471 7.84315C7.34314 7.84315 8.01471 7.17158 8.01471 6.34315C8.01471 5.51473 7.34314 4.84315 6.51471 4.84315C5.68629 4.84315 5.01471 5.51473 5.01471 6.34315C5.01471 7.17158 5.68629 7.84315 6.51471 7.84315Z" />
          </>
        )}
      </svg>
    </>
  );
}
