import React from 'react';
import { View, StyleSheet } from 'react-native';
import CardColumn from './CardColumn';
 
        // --- Placeholder Data (using local require for images) ---
        const cardsCol1 = [
        { imgSrc: require('../../assets/images/loginImg/image1.png'), color: '#4FC3F7' },
        { imgSrc: require('../../assets/images/loginImg/image2.png'), color: '#F06292' },
        { imgSrc: require('../../assets/images/loginImg/image3.png'), color: '#81C784' },
        { imgSrc: require('../../assets/images/loginImg/image4.png'), color: '#FFB74D' },
        ];
 
        const cardsCol2 = [
        { imgSrc: require('../../assets/images/loginImg/image5.png'), color: '#BA68C8' },
        { imgSrc: require('../../assets/images/loginImg/image6.png'), color: '#64B5F6' },
        { imgSrc: require('../../assets/images/loginImg/image7.png'), color: '#FF8A65' },
        { imgSrc: require('../../assets/images/loginImg/image8.png'), color: '#AED581' },
        ];
 
interface AnimatedLoginBackgroundProps {
  isFocused: boolean;
}

const AnimatedLoginBackground = ({ isFocused }: AnimatedLoginBackgroundProps) => (
        <View style={styles.container} pointerEvents="none">
            <View style={styles.gridContainer}>
                {/* Column 1 is positioned on the left */}
                <View style={styles.columnWrapper}>
                    <CardColumn cards={cardsCol1} direction="up" isFocused={isFocused} style={{}} />
                </View>
                {/* Column 2 is positioned on the right with a top offset */}
                <View style={[styles.columnWrapper, { paddingTop: '10%' }]}>
                    <CardColumn cards={cardsCol2} direction="down" isFocused={isFocused} style={{}} />
                </View>
            </View>
        </View>
        );
 
        const styles = StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            zIndex: -1,
        },
        gridContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            transform: [{ rotate: '-6deg' }, { scale: 1 }], // Rotate and scale up
        },
        // Each column wrapper now has a defined width
        columnWrapper: {
            width: '50%',
        },
       
        });
 
        export default AnimatedLoginBackground;
