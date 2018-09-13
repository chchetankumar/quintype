const findDistance = ( pos1, pos2) => {
        let [row1,col1] = pos1.split('_');
        let [row2,col2] = pos2.split('_');
        let rowidx1 = parseInt(row1.replace('r',''));
        let rowidx2 = parseInt(row2.replace('r',''));
        let colidx1 = parseInt(col1.replace('c',''));
        let colidx2 = parseInt(col2.replace('c',''));
        return Math.abs(rowidx1-rowidx2)+Math.abs(colidx1-colidx2)
}   

const FindClosestDiamond= (current, positions) => {
        let [r,c] = current.split('_');
        let same_row = [];
        let other_rows =[];
        let direction= null;
        let distance = null;
        let col_index = parseInt(c.replace('c',''));
        for ( let position of Object.keys(positions)){
            let [row,co] = position.split('_');
            if ( row == r ) {
                same_row.push(co);
            } else {
                other_rows.push(position);
            }
        } 

        if (same_row.length > 0) {
            for ( let col of same_row ) {
                let column_number = parseInt(col.replace('c',''));
                if ( col_index > column_number && ((col_index -column_number) < distance || distance ==null)) {
                    distance = col_index-column_number;
                    direction = 'left';
                } else if ( col_index < column_number && ((column_number -col_index)< distance || distance ==null)) {
                    distance = column_number -col_index;
                    direction = 'right';
                }
            }
        }

        for ( let pos of other_rows ) {
            if ( findDistance(current, pos) < distance || distance == null ) {
                distance = findDistance(current, pos);
                let r_idx = r.replace('r','');
                let [pr,pc] = pos.split('_');
                let pr_idx = pr.replace('r','');
                if ( r_idx < pr_idx) {
                    direction='down';
                } else if ( r_idx> pr_idx ) {
                    direction='up';
                }
            }
        }
        return direction;
};

export default FindClosestDiamond;
