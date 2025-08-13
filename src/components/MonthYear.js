import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableHighlight, Dimensions } from 'react-native';

const MonthYear = (props) => {
    const month_data = [
        { key: 1, name: 'Januari' },
        { key: 2, name: 'Februari' },
        { key: 3, name: 'Maret' },
        { key: 4, name: 'April' },
        { key: 5, name: 'Mei' },
        { key: 6, name: 'Juni' },
        { key: 7, name: 'Juli' },
        { key: 8, name: 'Agustus' },
        { key: 9, name: 'September' },
        { key: 10, name: 'Oktober' },
        { key: 11, name: 'November' },
        { key: 12, name: 'Desember' },
    ]

    const { width, height } = Dimensions.get('window')

    const [month, setMonth] = useState(month_data[new Date().getMonth()])
    const [year, setYear] = useState(new Date().getFullYear())

    useEffect(() => {
        props.onChangeYear(year)
    }, [year])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.isShow}
            onRequestClose={props.close}
        >
            <TouchableHighlight style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={props.close}>
                <View />
            </TouchableHighlight>
            <View style={{ flex: 1 / 2, backgroundColor: 'white' }} >
                <View style={styles.yearContainer}>
                    <TouchableOpacity onPress={() => {
                        setYear(year - 1)
                        props.onChangeYear(year - 1)
                    }}>
                        <Text>Prev</Text>
                    </TouchableOpacity>
                    <Text style={styles.yearLabel}>{year}</Text>
                    <TouchableOpacity onPress={() => {
                        setYear(year + 1)
                        props.onChangeYear(year + 1)
                    }}>
                        <Text>Next</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.monthContainer}>
                    {month_data.map((item, index) =>
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setMonth(item)
                                props.onChangeMonth(item)
                            }}
                            style={[styles.month, { width: (width / 3), backgroundColor: item.key == month.key ? "blue" : 'white' }]}>
                            <Text style={{ color: item.key == month.key ? 'white' : 'black' }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    )
}

const styles = {
    yearContainer: {
        padding: 15,
        height: 55,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    monthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },

    month: {
        height: 50, alignItems: 'center', justifyContent: 'center',
    },

    yearLabel: {
        fontWeight: 'bold', 
        fontSize: 25
    },
}

export default MonthYear