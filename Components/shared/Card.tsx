

interface Props {
  mail:string;
  tel:string;
  city:string;
  series:string;
  number:string;
  cardNumber:string;
}


const Card = ({mail, tel, city, series, number, cardNumber} : Props) => {


  const cardNumberFormat = cardNumber.replace(/(.{4})/g, "$1 ");



  return (
    <>
      <div className="flex flex-wrap gap-5 justify-start text-small-regular border border-stone-400 p-4 rounded-xl relative text-white fontbold shadow-2xl transition-transform transform hover:scale-105 ">
        <div className="flex-col ">
          <div className="border-b border-stone-600 pb-1">
            <p className="font-medium ">Номер карты</p>
            <p className="font-medium tracking-more-wider text-base-regular">
              {cardNumberFormat}
            </p>
          </div>
          <div className="flex-col gap-2 pt-1">
            <p className="font-medium ">Пасспорт</p>
            <p className="font-medium tracking-more-wider text-base-regular">{series} {number}</p>
          </div>
        </div>
        <div className="flex-col">
        <div className="border-b border-stone-600 pb-1">
            <p className="font-medium ">Почта</p>
            <p className="font-medium tracking-more-wider text-base-regular">{mail}</p>
          </div>
          <div className="flex-col gap-2 pt-1">
            <p className="font-medium">Номер телефона</p>
            <p className="font-medium tracking-more-wider text-base-regular">{tel}</p>
          </div>
        </div>
        <div className="flex-col">
          <div className="border-b border-stone-600 pb-1">
            <p className="font-medium">Город проживания</p>
            <p className="font-medium tracking-more-wider text-base-regular">{city}</p>
          </div>
        </div>

      </div>
    </>
  );
};

export default Card;
