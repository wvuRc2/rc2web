import filesize from 'filesize';

export class FileSizeValueConverter {
	toView(value, format) {
		return filesize(value);
	}
};
