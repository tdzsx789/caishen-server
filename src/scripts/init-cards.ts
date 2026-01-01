import mongoose from 'mongoose';
import connectDB from '../config/db';
import Card from '../models/card.model';

const CATEGORIES = ['BitBitcoin', 'Ethereum', 'Caishen', 'TBC'];

const initCards = async () => {
  await connectDB();

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  const items = [];

  for (const activeCategory of CATEGORIES) {
    for (let i = 0; i < 24; i++) {
      const startHour = i;
      const endHour = i + 1;
      
      const startTimeStr = `${today} ${startHour.toString().padStart(2, '0')}:00:00`;
      const endTimeStr = `${today} ${endHour.toString().padStart(2, '0')}:00:00`;
      
      const timeLabel = `${endHour}时`;
      
      const id = `${activeCategory}_guess_${startHour}-${endHour}`;
      
      items.push({
        key: id,
        id: id,
        show: true,
        title: `${activeCategory} 涨跌预测${timeLabel}`,
        description: `${activeCategory}在${timeLabel}是涨还是跌？`,
        activityDescription: `活动说明：这是一个关于${activeCategory}市场涨跌预测的投票活动。参与者可以根据市场趋势选择"涨"或"跌"，并根据赔率进行下注。活动将在${timeLabel}结束，结果将在活动结束后公布。`,
        tradingVolume: 0,
        endTime: endTimeStr,
        startTime: startTimeStr,
        rise: 0,
        fall: 0,
        category: activeCategory,
        subType: 'guess',
        periodType: 'hour'
      });
    }

    // 2. Days: 7 days starting from today
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() + d);
      const Y = date.getFullYear();
      const M = date.getMonth() + 1;
      const D = date.getDate();
      const MM = String(M).padStart(2, '0');
      const DD = String(D).padStart(2, '0');
      const dateStr = `${Y}-${MM}-${DD}`;

      const id = `${activeCategory}_guess_day${MM}${DD}`;
      
      items.push({
        key: id,
        id: id,
        show: true,
        title: `${activeCategory} 预测${M}月${D}日`,
        description: `${activeCategory}在${M}月${D}日是涨还是跌？`,
        activityDescription: `活动将在${M}月${D}日24时结束`,
        tradingVolume: 0,
        endTime: `${dateStr} 24:00:00`,
        startTime: `${dateStr} 00:00:00`,
        rise: 0,
        fall: 0,
        category: activeCategory,
        subType: 'guess',
        periodType: 'day'
      });
    }

    // 3. Months: Remaining months of the current year (including current month)
    const currentMonthIndex = now.getMonth();
    for (let m = currentMonthIndex; m < 12; m++) {
      const M = m + 1;
      const MM = String(M).padStart(2, '0');
      // Get last day of the month
      const lastDayDate = new Date(year, M, 0);
      const lastDay = lastDayDate.getDate();
      
      const id = `${activeCategory}_guess_month${MM}`;
      
      items.push({
        key: id,
        id: id,
        show: true,
        title: `${activeCategory} 预测${M}月份`,
        description: `${activeCategory}在${M}月份是涨还是跌？`,
        activityDescription: `活动将在${M}月${lastDay}日24时结束`,
        tradingVolume: 0,
        endTime: `${year}-${MM}-${lastDay} 24:00:00`,
        startTime: `${year}-${MM}-01 00:00:00`,
        rise: 0,
        fall: 0,
        category: activeCategory,
        subType: 'guess',
        periodType: 'month'
      });
    }

    // 4. Year: 2026
    const targetYear = 2026;
    const idYear = `${activeCategory}_guess_year${targetYear}`;
    
    items.push({
      key: idYear,
      id: idYear,
      show: true,
      title: `${activeCategory} 预测${targetYear}年`,
      description: `${activeCategory}在${targetYear}年是涨还是跌？`,
      activityDescription: `活动将在${targetYear}年12月31日24时结束`,
      tradingVolume: 0,
      endTime: `${targetYear}-12-31 24:00:00`,
      startTime: `${targetYear}-01-01 00:00:00`,
      rise: 0,
      fall: 0,
      category: activeCategory,
      subType: 'guess',
      periodType: 'year'
    });

    // 5. Multiple choice mock data
    const multipleOptions = activeCategory === 'Ethereum' ? [
      "10000以上", "8000以上", "7000以上", "6000以上", "5000以上", "4000以上", "2500以下", "2000以下", "1500以下", "1000以下"
    ] : [
      "20万以上", "15万以上", "10万以上", "11万以上", "12万以上", "13万以上", "14万以上", "15万以上", "8万以下", "7万以下", "6万以下", "5万以下", "4万以下", "3万以下", "2万以下"
    ];

    const multipleId = `${activeCategory}_multiple_hour`;
    
    // Create multiple choice cards for the next 24 hours (similar to hourly guess)
    for (let i = 0; i < 24; i++) {
        const startHour = i;
        const endHour = i + 1;
        const startTimeStr = `${today} ${startHour.toString().padStart(2, '0')}:00:00`;
        const endTimeStr = `${today} ${endHour.toString().padStart(2, '0')}:00:00`;
        const timeLabel = `${endHour}时`;
        const id = `${activeCategory}_multiple_${startHour}-${endHour}`;

        items.push({
          key: id,
          id: id,
          show: true,
          title: `${activeCategory} 多重选择${timeLabel}`,
          description: `${activeCategory}在${timeLabel}的价格区间？`,
          activityDescription: `活动说明：这是一个关于${activeCategory}价格区间的预测活动。`,
          tradingVolume: 0,
          endTime: endTimeStr,
          startTime: startTimeStr,
          rise: 0,
          fall: 0,
          category: activeCategory,
          subType: 'multiple',
          periodType: 'hour',
          options: multipleOptions.map(name => ({
            name,
            tradingVolume: 0,
            chance: 0,
            price: 0
          }))
        });
    }

    // Days for multiple choice
    for (let d = 0; d < 7; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() + d);
        const Y = date.getFullYear();
        const M = date.getMonth() + 1;
        const D = date.getDate();
        const MM = String(M).padStart(2, '0');
        const DD = String(D).padStart(2, '0');
        const dateStr = `${Y}-${MM}-${DD}`;
  
        const id = `${activeCategory}_multiple_day${MM}${DD}`;
        
        items.push({
          key: id,
          id: id,
          show: true,
          title: `${activeCategory} 多重选择预测${M}月${D}日`,
          description: `${activeCategory}在${M}月${D}日的价格区间？`,
          activityDescription: `活动将在${M}月${D}日24时结束`,
          tradingVolume: 0,
          endTime: `${dateStr} 24:00:00`,
          startTime: `${dateStr} 00:00:00`,
          rise: 0,
          fall: 0,
          category: activeCategory,
          subType: 'multiple',
          periodType: 'day',
          options: multipleOptions.map(name => ({
            name,
            tradingVolume: 0,
            chance: 0,
            price: 0
          }))
        });
    }
    
    // Months for multiple choice
    for (let m = currentMonthIndex; m < 12; m++) {
        const M = m + 1;
        const MM = String(M).padStart(2, '0');
        const lastDayDate = new Date(year, M, 0);
        const lastDay = lastDayDate.getDate();
        
        const id = `${activeCategory}_multiple_month${MM}`;
        
        items.push({
          key: id,
          id: id,
          show: true,
          title: `${activeCategory} 多重选择预测${M}月份`,
          description: `${activeCategory}在${M}月份的价格区间？`,
          activityDescription: `活动将在${M}月${lastDay}日24时结束`,
          tradingVolume: 0,
          endTime: `${year}-${MM}-${lastDay} 24:00:00`,
          startTime: `${year}-${MM}-01 00:00:00`,
          rise: 0,
          fall: 0,
          category: activeCategory,
          subType: 'multiple',
          periodType: 'month',
          options: multipleOptions.map(name => ({
            name,
            tradingVolume: 0,
            chance: 0,
            price: 0
          }))
        });
    }

    // Year for multiple choice
    const idYearMultiple = `${activeCategory}_multiple_year${targetYear}`;
    items.push({
      key: idYearMultiple,
      id: idYearMultiple,
      show: true,
      title: `多重选择预测${targetYear}年`,
      description: `在${targetYear}年的价格区间？`,
      activityDescription: `活动将在${targetYear}年12月31日24时结束`,
      tradingVolume: 0,
      endTime: `${targetYear}-12-31 24:00:00`,
      startTime: `${targetYear}-01-01 00:00:00`,
      rise: 0,
      fall: 0,
      category: activeCategory,
      subType: 'multiple',
      periodType: 'year',
      options: multipleOptions.map(name => ({
        name,
        tradingVolume: 0,
        chance: 0,
        price: 0
      }))
    });
  }

  try {
    const operations = items.map(item => ({
      updateOne: {
        filter: { id: item.id },
        update: { $set: item },
        upsert: true
      }
    }));

    const result = await Card.bulkWrite(operations);
    console.log(`Successfully processed ${items.length} cards.`);
    console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`);
  } catch (error) {
    console.error('Error initializing cards:', error);
  }

  process.exit(0);
};

initCards();
