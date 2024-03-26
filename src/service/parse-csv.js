import Papa from 'papaparse';

function removeLeadingZeros(hexString) {
    // Удаляем префикс "0x", если он есть
    const trimmedString = hexString.startsWith('0x') ? hexString.slice(2) : hexString;
    // Удаляем ведущие нули, но оставляем хотя бы один символ, если строка состоит только из нулей
    const result = trimmedString.replace(/^0+(?!$)/, '');
    // Проверяем, осталась ли строка пустой после удаления ведущих нулей
    // Если да, возвращаем "00", иначе возвращаем результат
    if(result === '') {
        return '00';
    }

    if(result.length === 1) {
        return "0"+result[0];
    }

    return result;
}

function parseCsv(file) {
    const results = [];
    let currentPacket = null;

    return new Promise(resolve => {
        Papa.parse(file, {
            header: true, // Используем заголовки столбцов в качестве ключей в каждом объекте
            step: function(row) {
                const data = row.data;

                if (data.type === 'header_pid') {
                    if (currentPacket) results.push(currentPacket);

                    const value = removeLeadingZeros(data.protected_id);

                    currentPacket = { header_pid: value, time: data.start_time, data: [], checksum: undefined };
                } else if ((data.type === 'data' || data.type === 'data_or_checksum') && currentPacket) {
                    const value = removeLeadingZeros(data.data);
                    currentPacket.data.push(value);
                } else if (data.type === 'checksum' && currentPacket) {
                    currentPacket.checksum = removeLeadingZeros(data.checksum);
                }
            },
            complete: function() {
                if (currentPacket) results.push(currentPacket);
                resolve(results);
            }
        });
    })
}

export default parseCsv;